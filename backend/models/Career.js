const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Career title is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Career title cannot exceed 100 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    maxlength: [2000, 'Full description cannot exceed 2000 characters']
  },
  skills: [{
    type: String,
    required: true,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Marketing',
      'Design',
      'Engineering',
      'Business',
      'Science',
      'Arts',
      'Other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  salaryRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  educationRequirements: {
    type: String,
    required: true,
    enum: ['High School', 'Associate', 'Bachelor', 'Master', 'Doctorate', 'Certification', 'Self-taught']
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
  },
  jobOutlook: {
    type: String,
    required: true,
    enum: ['Growing', 'Stable', 'Declining', 'Emerging']
  },
  personalityTraits: [{
    type: String,
    enum: [
      'Analytical',
      'Creative',
      'Social',
      'Technical',
      'Leadership',
      'Practical',
      'Detail-oriented',
      'Innovative',
      'Collaborative',
      'Independent'
    ]
  }],
  workEnvironment: {
    type: String,
    required: true,
    enum: ['Office', 'Remote', 'Hybrid', 'Field', 'Laboratory', 'Studio', 'Hospital', 'School', 'Factory', 'Other']
  },
  workSchedule: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Flexible', 'Shift work', 'Freelance', 'Contract']
  },
  topCompanies: [{
    name: String,
    description: String
  }],
  certifications: [{
    name: String,
    issuingBody: String,
    description: String
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['Course', 'Book', 'Website', 'Video', 'Article']
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  searchTags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Index for better query performance (excluding title which is already indexed by unique: true)
careerSchema.index({ category: 1 });
careerSchema.index({ 'personalityTraits': 1 });
careerSchema.index({ searchTags: 1 });
careerSchema.index({ popularity: -1 });

// Method to get average salary
careerSchema.methods.getAverageSalary = function() {
  return Math.round((this.salaryRange.min + this.salaryRange.max) / 2);
};

// Method to check if career matches personality traits
careerSchema.methods.matchesPersonality = function(traits) {
  return this.personalityTraits.some(trait => traits.includes(trait));
};

// Method to get formatted salary range
careerSchema.methods.getFormattedSalaryRange = function() {
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.salaryRange.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return `${formatSalary(this.salaryRange.min)} - ${formatSalary(this.salaryRange.max)}`;
};

// Virtual for skill count
careerSchema.virtual('skillCount').get(function() {
  return this.skills.length;
});

// Ensure virtual fields are serialized
careerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Career', careerSchema); 