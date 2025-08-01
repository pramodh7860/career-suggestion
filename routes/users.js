const express = require('express');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');

    // Get recent quiz results
    const recentQuizResults = await QuizResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('-answers');

    // Get quiz statistics
    const totalQuizzes = await QuizResult.countDocuments({ userId: req.user._id });
    const completedQuizzes = await QuizResult.countDocuments({ 
      userId: req.user._id, 
      isCompleted: true 
    });

    // Calculate average score
    const quizResults = await QuizResult.find({ userId: req.user._id })
      .select('scores');
    
    let averageScore = 0;
    if (quizResults.length > 0) {
      const totalScore = quizResults.reduce((sum, result) => {
        const scores = Object.values(result.scores);
        return sum + (scores.reduce((a, b) => a + b, 0) / scores.length);
      }, 0);
      averageScore = Math.round((totalScore / quizResults.length) * 20); // Convert to percentage
    }

    const dashboardData = {
      user: user.getPublicProfile(),
      stats: {
        totalQuizzes,
        completedQuizzes,
        averageScore,
        savedCareers: user.savedCareers.length
      },
      recentQuizResults
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// @desc    Get user's quiz results
// @route   GET /api/users/quiz-results
// @access  Private
router.get('/quiz-results', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const quizResults = await QuizResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-answers');

    const total = await QuizResult.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: quizResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Quiz results fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz results'
    });
  }
});

// @desc    Get user's saved careers
// @route   GET /api/users/saved-careers
// @access  Private
router.get('/saved-careers', protect, async (req, res) => {
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

// @desc    Get user's career recommendations
// @route   GET /api/users/recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
  try {
    // Get user's latest quiz result
    const latestQuizResult = await QuizResult.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    if (!latestQuizResult) {
      return res.json({
        success: true,
        data: {
          message: 'No quiz results found. Take a quiz to get recommendations.',
          recommendations: []
        }
      });
    }

    // Get top recommendations from latest quiz
    const recommendations = latestQuizResult.careerRecommendations || [];

    res.json({
      success: true,
      data: {
        quizDate: latestQuizResult.createdAt,
        recommendations
      }
    });
  } catch (error) {
    console.error('Recommendations fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recommendations'
    });
  }
});

// @desc    Get user's progress statistics
// @route   GET /api/users/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const quizResults = await QuizResult.find({ userId: req.user._id })
      .select('scores createdAt');

    // Calculate progress over time
    const progressData = quizResults.map(result => ({
      date: result.createdAt,
      scores: result.scores,
      averageScore: Object.values(result.scores).reduce((a, b) => a + b, 0) / Object.keys(result.scores).length
    }));

    // Calculate skill development
    const skillDevelopment = {
      analytical: 0,
      creative: 0,
      social: 0,
      technical: 0,
      leadership: 0,
      practical: 0
    };

    if (progressData.length > 0) {
      const latestScores = progressData[progressData.length - 1].scores;
      Object.keys(skillDevelopment).forEach(skill => {
        skillDevelopment[skill] = Math.round(latestScores[skill] * 20); // Convert to percentage
      });
    }

    res.json({
      success: true,
      data: {
        progressData,
        skillDevelopment,
        totalQuizzes: quizResults.length
      }
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    // Delete user's quiz results
    await QuizResult.deleteMany({ userId: req.user._id });

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting account'
    });
  }
});

// @desc    Export user data
// @route   GET /api/users/export
// @access  Private
router.get('/export', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');

    const quizResults = await QuizResult.find({ userId: req.user._id })
      .select('-__v');

    const exportData = {
      user: user.getPublicProfile(),
      quizResults,
      exportDate: new Date().toISOString()
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=user-data.json');
    
    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    console.error('Data export error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error exporting data'
    });
  }
});

module.exports = router; 