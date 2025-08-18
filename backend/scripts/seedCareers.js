const mongoose = require('mongoose');
const Career = require('../models/Career');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://pramodhkumar782006:pramodh786@cluster0.a0woy.mongodb.net/career_app?retryWrites=true&w=majority&appName=Cluster0';

const careersData = [
  {
    title: "Software Engineer",
    shortDescription: "Designs, develops, and maintains software applications.",
    fullDescription: "A Software Engineer designs, develops, and maintains software applications across various platforms. This role requires strong problem-solving skills, logical thinking, and continuous learning in various programming languages and technologies like Python, JavaScript, Java, and C++.",
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
    category: "Technology",
    subcategory: "Software Development",
    salaryRange: {
      min: 70000,
      max: 150000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Entry Level",
    jobOutlook: "Growing",
    personalityTraits: ["Analytical", "Technical", "Detail-oriented"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "Google", description: "Tech giant with innovative projects" },
      { name: "Microsoft", description: "Leading software company" },
      { name: "Amazon", description: "E-commerce and cloud computing leader" }
    ],
    certifications: [
      { name: "AWS Certified Developer", issuingBody: "Amazon Web Services", description: "Cloud development certification" },
      { name: "Microsoft Certified: Azure Developer", issuingBody: "Microsoft", description: "Azure development certification" }
    ],
    resources: [
      { title: "The Pragmatic Programmer", url: "https://pragprog.com", type: "Book" },
      { title: "freeCodeCamp", url: "https://freecodecamp.org", type: "Course" }
    ],
    searchTags: ["programming", "software", "development", "coding", "tech"]
  },
  {
    title: "Data Scientist",
    shortDescription: "Analyzes large datasets to extract insights and build models.",
    fullDescription: "A Data Scientist collects, analyzes, and interprets large datasets to help organizations make better decisions. They use statistical methods, machine learning algorithms, and programming languages like Python and R to uncover patterns and predict future outcomes.",
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
    category: "Technology",
    subcategory: "Data Science",
    salaryRange: {
      min: 80000,
      max: 160000,
      currency: "USD"
    },
    educationRequirements: "Master",
    experienceLevel: "Mid Level",
    jobOutlook: "Growing",
    personalityTraits: ["Analytical", "Technical", "Detail-oriented"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "Netflix", description: "Data-driven entertainment company" },
      { name: "Spotify", description: "Music streaming with data insights" },
      { name: "Uber", description: "Transportation with data science" }
    ],
    certifications: [
      { name: "IBM Data Science Professional", issuingBody: "IBM", description: "Comprehensive data science certification" },
      { name: "Google Data Analytics", issuingBody: "Google", description: "Data analytics certification" }
    ],
    resources: [
      { title: "Introduction to Statistical Learning", url: "https://www.statlearning.com", type: "Book" },
      { title: "Kaggle", url: "https://kaggle.com", type: "Website" }
    ],
    searchTags: ["data", "analytics", "machine learning", "statistics", "python"]
  },
  {
    title: "Product Manager",
    shortDescription: "Oversees the development and strategy of a product.",
    fullDescription: "A Product Manager guides the success of a product and leads the cross-functional team that is responsible for improving it. They define the product vision, strategy, roadmap, and features based on market research and customer needs.",
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
    category: "Business",
    subcategory: "Product Management",
    salaryRange: {
      min: 90000,
      max: 180000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Mid Level",
    jobOutlook: "Growing",
    personalityTraits: ["Leadership", "Social", "Analytical"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "Apple", description: "Innovative product design" },
      { name: "Slack", description: "Communication platform" },
      { name: "Airbnb", description: "Sharing economy platform" }
    ],
    certifications: [
      { name: "Certified Scrum Product Owner", issuingBody: "Scrum Alliance", description: "Agile product management" },
      { name: "Pragmatic Institute", issuingBody: "Pragmatic Institute", description: "Product management certification" }
    ],
    resources: [
      { title: "Inspired", url: "https://svpg.com", type: "Book" },
      { title: "Product Hunt", url: "https://producthunt.com", type: "Website" }
    ],
    searchTags: ["product", "management", "strategy", "agile", "roadmap"]
  },
  {
    title: "UX/UI Designer",
    shortDescription: "Focuses on user experience and interface design.",
    fullDescription: "A UX/UI Designer focuses on creating intuitive, enjoyable, and aesthetically pleasing user experiences for digital products. They conduct user research, create wireframes and prototypes, and design the visual interface.",
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
    category: "Design",
    subcategory: "Digital Design",
    salaryRange: {
      min: 65000,
      max: 130000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Entry Level",
    jobOutlook: "Growing",
    personalityTraits: ["Creative", "Social", "Detail-oriented"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "Figma", description: "Design tool company" },
      { name: "Adobe", description: "Creative software company" },
      { name: "InVision", description: "Design collaboration platform" }
    ],
    certifications: [
      { name: "Google UX Design", issuingBody: "Google", description: "UX design certification" },
      { name: "Nielsen Norman Group", issuingBody: "NN/g", description: "UX research certification" }
    ],
    resources: [
      { title: "Don't Make Me Think", url: "https://sensible.com", type: "Book" },
      { title: "Dribbble", url: "https://dribbble.com", type: "Website" }
    ],
    searchTags: ["design", "ux", "ui", "user experience", "prototyping"]
  },
  {
    title: "Marketing Specialist",
    shortDescription: "Develops and implements strategies to promote products/services.",
    fullDescription: "A Marketing Specialist develops and implements strategies to promote products or services. This involves market research, campaign creation, digital marketing, social media management, and analyzing consumer behavior to drive sales and brand awareness.",
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
    category: "Marketing",
    subcategory: "Digital Marketing",
    salaryRange: {
      min: 50000,
      max: 100000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Entry Level",
    jobOutlook: "Growing",
    personalityTraits: ["Social", "Creative", "Practical"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "HubSpot", description: "Marketing automation platform" },
      { name: "Mailchimp", description: "Email marketing platform" },
      { name: "Hootsuite", description: "Social media management" }
    ],
    certifications: [
      { name: "Google Ads", issuingBody: "Google", description: "Digital advertising certification" },
      { name: "HubSpot Marketing", issuingBody: "HubSpot", description: "Inbound marketing certification" }
    ],
    resources: [
      { title: "Contagious", url: "https://www.simonandschuster.com", type: "Book" },
      { title: "Neil Patel", url: "https://neilpatel.com", type: "Website" }
    ],
    searchTags: ["marketing", "digital", "social media", "seo", "campaigns"]
  },
  {
    title: "Financial Analyst",
    shortDescription: "Provides guidance on investment decisions and financial planning.",
    fullDescription: "A Financial Analyst provides guidance to businesses and individuals making investment decisions. They assess the performance of stocks, bonds, and other investments, analyze financial data, and forecast business trends.",
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
    category: "Finance",
    subcategory: "Investment Analysis",
    salaryRange: {
      min: 60000,
      max: 120000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Entry Level",
    jobOutlook: "Stable",
    personalityTraits: ["Analytical", "Practical", "Detail-oriented"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "Goldman Sachs", description: "Investment banking" },
      { name: "JP Morgan", description: "Financial services" },
      { name: "Morgan Stanley", description: "Investment management" }
    ],
    certifications: [
      { name: "CFA", issuingBody: "CFA Institute", description: "Chartered Financial Analyst" },
      { name: "FRM", issuingBody: "GARP", description: "Financial Risk Manager" }
    ],
    resources: [
      { title: "The Intelligent Investor", url: "https://www.harpercollins.com", type: "Book" },
      { title: "Bloomberg", url: "https://bloomberg.com", type: "Website" }
    ],
    searchTags: ["finance", "investment", "analysis", "modeling", "excel"]
  },
  {
    title: "Graphic Designer",
    shortDescription: "Creates visual concepts for branding, web, and print.",
    fullDescription: "A Graphic Designer creates visual concepts, using computer software or by hand, to communicate ideas that inspire, inform, or captivate consumers. They work on logos, websites, advertisements, magazines, and more, utilizing tools like Adobe Creative Suite.",
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
    category: "Design",
    subcategory: "Visual Design",
    salaryRange: {
      min: 45000,
      max: 90000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Entry Level",
    jobOutlook: "Stable",
    personalityTraits: ["Creative", "Detail-oriented", "Independent"],
    workEnvironment: "Studio",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "Pentagram", description: "Design consultancy" },
      { name: "Landor", description: "Brand consulting" },
      { name: "Wolff Olins", description: "Brand strategy" }
    ],
    certifications: [
      { name: "Adobe Certified Expert", issuingBody: "Adobe", description: "Adobe software certification" },
      { name: "AIGA", issuingBody: "AIGA", description: "Professional design association" }
    ],
    resources: [
      { title: "Thinking with Type", url: "https://www.thinkingwithtype.com", type: "Book" },
      { title: "Behance", url: "https://behance.net", type: "Website" }
    ],
    searchTags: ["design", "graphic", "adobe", "typography", "branding"]
  },
  {
    title: "Cybersecurity Analyst",
    shortDescription: "Protects computer systems and networks from threats.",
    fullDescription: "A Cybersecurity Analyst protects an organization's computer systems and networks from cyber threats. They monitor for breaches, implement security measures, respond to incidents, and stay updated on the latest security vulnerabilities.",
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
    category: "Technology",
    subcategory: "Cybersecurity",
    salaryRange: {
      min: 70000,
      max: 140000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Entry Level",
    jobOutlook: "Growing",
    personalityTraits: ["Technical", "Analytical", "Detail-oriented"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "CrowdStrike", description: "Cybersecurity platform" },
      { name: "Palo Alto Networks", description: "Network security" },
      { name: "FireEye", description: "Threat intelligence" }
    ],
    certifications: [
      { name: "CompTIA Security+", issuingBody: "CompTIA", description: "Entry-level security certification" },
      { name: "CISSP", issuingBody: "ISC²", description: "Advanced security certification" }
    ],
    resources: [
      { title: "The Art of Deception", url: "https://www.wiley.com", type: "Book" },
      { title: "HackerOne", url: "https://hackerone.com", type: "Website" }
    ],
    searchTags: ["security", "cybersecurity", "network", "threats", "penetration"]
  },
  {
    title: "Human Resources Manager",
    shortDescription: "Manages employee relations, recruitment, and company culture.",
    fullDescription: "A Human Resources Manager oversees all aspects of employee relations, including recruitment, onboarding, training, compensation, benefits, and maintaining a positive company culture. They ensure compliance with labor laws and support employee well-being.",
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
    category: "Business",
    subcategory: "Human Resources",
    salaryRange: {
      min: 60000,
      max: 120000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Mid Level",
    jobOutlook: "Stable",
    personalityTraits: ["Social", "Leadership", "Practical"],
    workEnvironment: "Office",
    workSchedule: "Full-time",
    topCompanies: [
      { name: "Workday", description: "HR software platform" },
      { name: "BambooHR", description: "HR management system" },
      { name: "Gusto", description: "Payroll and benefits" }
    ],
    certifications: [
      { name: "PHR", issuingBody: "HRCI", description: "Professional in Human Resources" },
      { name: "SHRM-CP", issuingBody: "SHRM", description: "Society for HR Management" }
    ],
    resources: [
      { title: "The HR Scorecard", url: "https://hbr.org", type: "Book" },
      { title: "SHRM", url: "https://shrm.org", type: "Website" }
    ],
    searchTags: ["hr", "human resources", "recruitment", "employee relations", "compliance"]
  },
  {
    title: "Content Writer",
    shortDescription: "Creates engaging written content for various platforms.",
    fullDescription: "A Content Writer produces clear, concise, and engaging written material for websites, blogs, marketing campaigns, and other digital platforms. They research topics, optimize content for SEO, and adapt their writing style to different audiences.",
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
    category: "Marketing",
    subcategory: "Content Marketing",
    salaryRange: {
      min: 40000,
      max: 80000,
      currency: "USD"
    },
    educationRequirements: "Bachelor",
    experienceLevel: "Entry Level",
    jobOutlook: "Growing",
    personalityTraits: ["Creative", "Social", "Independent"],
    workEnvironment: "Remote",
    workSchedule: "Flexible",
    topCompanies: [
      { name: "Grammarly", description: "Writing assistance platform" },
      { name: "Medium", description: "Content publishing platform" },
      { name: "Copyblogger", description: "Content marketing education" }
    ],
    certifications: [
      { name: "Content Marketing Institute", issuingBody: "CMI", description: "Content marketing certification" },
      { name: "Copyblogger", issuingBody: "Copyblogger", description: "Copywriting certification" }
    ],
    resources: [
      { title: "Everybody Writes", url: "https://www.annhandley.com", type: "Book" },
      { title: "Copyblogger", url: "https://copyblogger.com", type: "Website" }
    ],
    searchTags: ["content", "writing", "copywriting", "seo", "blogging"]
  }
];

async function seedCareers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing careers
    await Career.deleteMany({});
    console.log('🗑️  Cleared existing careers');

    // Insert new careers
    const insertedCareers = await Career.insertMany(careersData);
    console.log(`✅ Successfully seeded ${insertedCareers.length} careers`);

    // Log some statistics
    const categories = await Career.distinct('category');
    console.log('📊 Categories:', categories);

    const totalSkills = careersData.reduce((sum, career) => sum + career.skills.length, 0);
    console.log(`🔧 Total skills across all careers: ${totalSkills}`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedCareers(); 