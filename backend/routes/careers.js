const express = require('express');
const Career = require('../models/Career');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      limit = 20, 
      page = 1,
      sortBy = 'title',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { fullDescription: { $regex: search, $options: 'i' } },
        { searchTags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const careers = await Career.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const total = await Career.countDocuments(filter);

    res.json({
      success: true,
      data: careers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Careers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching careers'
    });
  }
});

// @desc    Get user's saved careers
// @route   GET /api/careers/saved
// @access  Private
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedCareers.careerId');

    const savedCareers = user.savedCareers.map(saved => ({
      _id: saved.careerId,
      title: saved.careerTitle,
      savedAt: saved.savedAt
    }));

    res.json({
      success: true,
      data: savedCareers
    });
  } catch (error) {
    console.error('Saved careers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching saved careers'
    });
  }
});

// @desc    Get career by ID
// @route   GET /api/careers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    // Increment popularity
    career.popularity += 1;
    await career.save();

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    console.error('Career fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching career'
    });
  }
});

// @desc    Get career categories
// @route   GET /api/careers/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Career.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching categories'
    });
  }
});

// @desc    Get popular careers
// @route   GET /api/careers/popular
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const careers = await Career.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(parseInt(limit))
      .select('title shortDescription category popularity');

    res.json({
      success: true,
      data: careers
    });
  } catch (error) {
    console.error('Popular careers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching popular careers'
    });
  }
});

// @desc    Save career to user's list
// @route   POST /api/careers/:id/save
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    // Check if already saved
    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedCareers.some(
      saved => saved.careerId === req.params.id
    );

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: 'Career already saved'
      });
    }

    // Add to saved careers
    user.savedCareers.push({
      careerId: req.params.id,
      careerTitle: career.title
    });

    await user.save();

    res.json({
      success: true,
      message: 'Career saved successfully'
    });
  } catch (error) {
    console.error('Save career error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving career'
    });
  }
});

// @desc    Remove career from user's list
// @route   DELETE /api/careers/:id/save
// @access  Private
router.delete('/:id/save', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.savedCareers = user.savedCareers.filter(
      saved => saved.careerId !== req.params.id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Career removed from saved list'
    });
  } catch (error) {
    console.error('Remove career error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing career'
    });
  }
});

// @desc    Get careers by personality traits
// @route   GET /api/careers/by-traits
// @access  Public
router.get('/by-traits', async (req, res) => {
  try {
    const { traits } = req.query;

    if (!traits) {
      return res.status(400).json({
        success: false,
        message: 'Traits parameter is required'
      });
    }

    const traitsArray = traits.split(',').map(trait => trait.trim());

    const careers = await Career.find({
      isActive: true,
      personalityTraits: { $in: traitsArray }
    }).select('title shortDescription category personalityTraits');

    res.json({
      success: true,
      data: careers
    });
  } catch (error) {
    console.error('Careers by traits fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching careers by traits'
    });
  }
});

// @desc    Get similar careers
// @route   GET /api/careers/:id/similar
// @access  Public
router.get('/:id/similar', async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    const similarCareers = await Career.find({
      _id: { $ne: req.params.id },
      isActive: true,
      $or: [
        { category: career.category },
        { personalityTraits: { $in: career.personalityTraits } },
        { experienceLevel: career.experienceLevel }
      ]
    })
    .limit(5)
    .select('title shortDescription category');

    res.json({
      success: true,
      data: similarCareers
    });
  } catch (error) {
    console.error('Similar careers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching similar careers'
    });
  }
});

module.exports = router; 