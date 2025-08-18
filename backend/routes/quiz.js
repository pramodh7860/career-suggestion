const express = require('express');
const { body, validationResult } = require('express-validator');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Career recommendation algorithm
const calculateCareerRecommendations = (scores) => {
  const careers = [
    {
      title: "Software Engineer",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Programming Languages (Python, JavaScript, Java, C++)",
        "Data Structures & Algorithms",
        "Version Control (Git)",
        "Database Management",
        "Software Development Lifecycle",
        "Problem Solving",
        "Team Collaboration",
        "Continuous Learning"
      ],
      description: "Designs, develops, and maintains software applications."
    },
    {
      title: "Data Scientist",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Python & R Programming",
        "Machine Learning",
        "Statistical Analysis",
        "Data Visualization",
        "SQL & Database Management",
        "Big Data Technologies",
        "Predictive Modeling",
        "Business Intelligence"
      ],
      description: "Analyzes large datasets to extract insights and build models."
    },
    {
      title: "Product Manager",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Product Strategy",
        "Market Research",
        "User Experience Design",
        "Agile/Scrum Methodologies",
        "Data Analysis",
        "Stakeholder Management",
        "Roadmap Planning",
        "Customer Development"
      ],
      description: "Oversees the development and strategy of a product."
    },
    {
      title: "UX/UI Designer",
      matchScore: 0,
      reasoning: "",
      skills: [
        "User Research",
        "Wireframing & Prototyping",
        "Adobe XD/Figma/Sketch",
        "Information Architecture",
        "Usability Testing",
        "Visual Design",
        "Interaction Design",
        "Design Systems"
      ],
      description: "Focuses on user experience and interface design."
    },
    {
      title: "Marketing Specialist",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Digital Marketing",
        "Social Media Management",
        "Content Creation",
        "SEO/SEM",
        "Email Marketing",
        "Analytics & Data Analysis",
        "Campaign Management",
        "Customer Research"
      ],
      description: "Develops and implements strategies to promote products/services."
    },
    {
      title: "Financial Analyst",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Financial Modeling",
        "Excel & Financial Software",
        "Statistical Analysis",
        "Risk Assessment",
        "Investment Analysis",
        "Financial Reporting",
        "Market Research",
        "Regulatory Compliance"
      ],
      description: "Provides guidance on investment decisions and financial planning."
    },
    {
      title: "Graphic Designer",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Adobe Creative Suite (Photoshop, Illustrator, InDesign)",
        "Typography",
        "Color Theory",
        "Layout Design",
        "Digital Illustration",
        "Brand Identity Design",
        "Print Design",
        "Web Design Fundamentals"
      ],
      description: "Creates visual concepts for branding, web, and print."
    },
    {
      title: "Cybersecurity Analyst",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Network Security",
        "Security Tools & Technologies",
        "Incident Response",
        "Vulnerability Assessment",
        "Security Compliance",
        "Threat Intelligence",
        "Penetration Testing",
        "Security Architecture"
      ],
      description: "Protects computer systems and networks from threats."
    },
    {
      title: "Human Resources Manager",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Recruitment & Talent Acquisition",
        "Employee Relations",
        "Performance Management",
        "HRIS Systems",
        "Labor Law Compliance",
        "Training & Development",
        "Compensation & Benefits",
        "Organizational Development"
      ],
      description: "Manages employee relations, recruitment, and company culture."
    },
    {
      title: "Content Writer",
      matchScore: 0,
      reasoning: "",
      skills: [
        "Content Writing",
        "SEO Optimization",
        "Copywriting",
        "Research Skills",
        "Editing & Proofreading",
        "Content Strategy",
        "Social Media Writing",
        "Brand Voice Development"
      ],
      description: "Creates engaging written content for various platforms."
    }
  ];

  // Calculate match scores based on personality scores
  careers.forEach(career => {
    let score = 0;
    let reasoning = [];

    // Analytical score affects technical careers
    if (scores.analytical > 3) {
      if (career.title === "Software Engineer" || career.title === "Data Scientist") {
        score += scores.analytical * 20;
        reasoning.push("Strong analytical thinking");
      }
    }

    // Creative score affects design careers
    if (scores.creative > 3) {
      if (career.title === "Graphic Designer" || career.title === "UX/UI Designer") {
        score += scores.creative * 25;
        reasoning.push("High creativity");
      }
    }

    // Social score affects people-oriented careers
    if (scores.social > 3) {
      if (career.title === "Human Resources Manager" || career.title === "Marketing Specialist") {
        score += scores.social * 20;
        reasoning.push("Strong interpersonal skills");
      }
    }

    // Technical score affects technical careers
    if (scores.technical > 3) {
      if (career.title === "Software Engineer" || career.title === "Data Scientist" || career.title === "Cybersecurity Analyst") {
        score += scores.technical * 25;
        reasoning.push("Technical aptitude");
      }
    }

    // Leadership score affects management careers
    if (scores.leadership > 3) {
      if (career.title === "Product Manager" || career.title === "Human Resources Manager") {
        score += scores.leadership * 20;
        reasoning.push("Leadership potential");
      }
    }

    // Practical score affects business careers
    if (scores.practical > 3) {
      if (career.title === "Financial Analyst" || career.title === "Marketing Specialist") {
        score += scores.practical * 15;
        reasoning.push("Practical approach");
      }
    }

    // Base score for all careers
    score += 20;

    career.matchScore = Math.min(100, Math.max(0, score));
    career.reasoning = reasoning.join(", ") || "Good general fit";
  });

  // Sort by match score and return top 5
  return careers
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
};

// @desc    Submit quiz results
// @route   POST /api/quiz/submit
// @access  Private
router.post('/submit', protect, [
  body('answers').isArray().withMessage('Answers must be an array'),
  body('quizType').isIn(['personality', 'skills', 'interests', 'comprehensive']).withMessage('Invalid quiz type'),
  body('completionTime').isNumeric().withMessage('Completion time must be a number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { answers, quizType, completionTime, feedback } = req.body;

    // Calculate scores based on answers
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      technical: 0,
      leadership: 0,
      practical: 0
    };

    // Process answers and calculate scores
    answers.forEach(answer => {
      const { category, answer: response } = answer;
      
      // Simple scoring logic based on answer values
      const answerValue = parseInt(response) || 0;
      
      switch (category) {
        case 'analytical':
          scores.analytical += answerValue;
          break;
        case 'creative':
          scores.creative += answerValue;
          break;
        case 'social':
          scores.social += answerValue;
          break;
        case 'technical':
          scores.technical += answerValue;
          break;
        case 'leadership':
          scores.leadership += answerValue;
          break;
        case 'practical':
          scores.practical += answerValue;
          break;
      }
    });

    // Normalize scores (assuming 5 questions per category, max score 5 each)
    Object.keys(scores).forEach(key => {
      scores[key] = Math.min(5, Math.max(0, scores[key] / 5));
    });

    // Get career recommendations
    const rawRecommendations = calculateCareerRecommendations(scores);
    // Map to schema fields (careerTitle, matchScore, etc.)
    const careerRecommendations = rawRecommendations.map(r => ({
      careerTitle: r.title,
      matchScore: r.matchScore,
      reasoning: r.reasoning,
      skills: r.skills,
      description: r.description
    }));
    const topCareer = careerRecommendations[0];

    // Create quiz result
    const quizResult = await QuizResult.create({
      userId: req.user._id,
      quizType,
      answers,
      scores,
      careerRecommendations,
      topCareer,
      completionTime,
      isCompleted: true,
      feedback
    });

    // Update user's quiz results
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        quizResults: {
          quizId: quizResult._id,
          score: Math.round((scores.analytical + scores.creative + scores.social + scores.technical + scores.leadership + scores.practical) / 6 * 100),
          careerRecommendations: careerRecommendations.map(career => career.careerTitle)
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Quiz results saved successfully',
      data: {
        quizResult: quizResult._id,
        scores,
        topCareer,
        careerRecommendations
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting quiz results'
    });
  }
});

// @desc    Get user's quiz history
// @route   GET /api/quiz/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const quizResults = await QuizResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-answers');

    res.json({
      success: true,
      data: quizResults
    });
  } catch (error) {
    console.error('Quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz history'
    });
  }
});

// @desc    Get specific quiz result
// @route   GET /api/quiz/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const quizResult = await QuizResult.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quizResult) {
      return res.status(404).json({
        success: false,
        message: 'Quiz result not found'
      });
    }

    res.json({
      success: true,
      data: quizResult
    });
  } catch (error) {
    console.error('Quiz result fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching quiz result'
    });
  }
});

module.exports = router; 