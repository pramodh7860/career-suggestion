const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizType: {
    type: String,
    required: true,
    enum: ['personality', 'skills', 'interests', 'comprehensive'],
    default: 'comprehensive'
  },
  answers: [{
    questionId: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  }],
  scores: {
    analytical: { type: Number, default: 0 },
    creative: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    leadership: { type: Number, default: 0 },
    practical: { type: Number, default: 0 }
  },
  careerRecommendations: [{
    careerTitle: {
      type: String,
      required: true
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reasoning: {
      type: String,
      required: true
    },
    skills: [String],
    description: String
  }],
  topCareer: {
    careerTitle: String,
    matchScore: Number,
    reasoning: String
  },
  completionTime: {
    type: Number, // in seconds
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: String,
    maxlength: 500
  },
  version: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true
});

// Index for better query performance
quizResultSchema.index({ userId: 1, createdAt: -1 });
quizResultSchema.index({ quizType: 1 });

// Method to calculate match percentage
quizResultSchema.methods.calculateMatchPercentage = function(careerTitle) {
  const recommendation = this.careerRecommendations.find(
    rec => rec.careerTitle === careerTitle
  );
  return recommendation ? recommendation.matchScore : 0;
};

// Method to get top recommendations
quizResultSchema.methods.getTopRecommendations = function(limit = 5) {
  return this.careerRecommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

// Virtual for average score
quizResultSchema.virtual('averageScore').get(function() {
  const scores = Object.values(this.scores);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
});

// Ensure virtual fields are serialized
quizResultSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('QuizResult', quizResultSchema); 