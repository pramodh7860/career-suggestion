# Career Compass - Career Exploration Platform

A comprehensive career exploration and assessment platform built with vanilla JavaScript, Express.js, and MongoDB.

## 🏗️ Project Structure

The project is organized into clear frontend and backend directories for better maintainability:

```
career-app-vanilla/
├── frontend/                 # Frontend application files
│   ├── pages/               # HTML pages
│   │   ├── index.html      # Home page
│   │   ├── login.html      # Login page
│   │   ├── register.html   # Registration page
│   │   ├── dashboard.html  # User dashboard
│   │   ├── quiz.html       # Career assessment quiz
│   │   ├── result.html     # Quiz results page
│   │   ├── explorer.html   # Career exploration page
│   │   ├── profile.html    # User profile page
│   │   ├── contact.html    # Contact page
│   │   ├── about.html      # About page
│   │   ├── privacy.html    # Privacy policy
│   │   └── forgot-password.html # Password reset
│   ├── styles/             # CSS stylesheets
│   │   ├── style.css       # Main styles
│   │   ├── dashboard.css   # Dashboard styles
│   │   ├── quiz.css        # Quiz styles
│   │   ├── profile.css     # Profile styles
│   │   ├── explorer.css    # Explorer styles
│   │   ├── result.css      # Results styles
│   │   ├── login.css       # Login styles
│   │   ├── contact.css     # Contact styles
│   │   ├── about.css       # About styles
│   │   └── privacy.css     # Privacy styles
│   ├── scripts/            # JavaScript files
│   │   ├── auth.js         # Authentication management
│   │   ├── script.js       # Main script
│   │   ├── dashboard.js    # Dashboard functionality
│   │   ├── quiz.js         # Quiz logic
│   │   ├── profile.js      # Profile management
│   │   ├── explorer.js     # Career exploration
│   │   ├── result.js       # Results display
│   │   ├── login.js        # Login handling
│   │   ├── register.js     # Registration handling
│   │   ├── contact.js      # Contact form
│   │   ├── about.js        # About page
│   │   ├── privacy.js      # Privacy page
│   │   └── forgot-password.js # Password reset
│   └── assets/             # Static assets
│       ├── favicon.svg     # Application favicon
│       └── images/         # Image files
├── backend/                 # Backend server files
│   ├── server.js           # Main Express server
│   ├── routes/             # API route handlers
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   ├── quiz.js         # Quiz routes
│   │   └── careers.js      # Career data routes
│   ├── models/             # MongoDB models
│   │   ├── User.js         # User model
│   │   ├── Career.js       # Career model
│   │   └── QuizResult.js   # Quiz results model
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # Authentication middleware
│   ├── scripts/            # Database scripts
│   │   └── seedCareers.js  # Career data seeding
│   ├── package.json        # Backend dependencies
│   ├── env.example         # Environment variables template
│   └── render.yaml         # Deployment configuration
├── server.js               # Main entry point
├── package.json            # Root package configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-app-vanilla
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   ```bash
   cp backend/env.example backend/.env
   # Edit backend/.env with your MongoDB connection string and JWT secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run install-deps` - Install backend dependencies

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Quiz
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results/:id` - Get quiz results

### Careers
- `GET /api/careers` - Get all careers
- `GET /api/careers/:id` - Get specific career details

## 🎯 Features

- **User Authentication**: Secure login/registration with JWT
- **Career Assessment**: AI-powered quiz to determine career fit
- **Personalized Dashboard**: Track progress and view recommendations
- **Career Explorer**: Browse and search different career paths
- **Learning Paths**: Curated YouTube resources for skill development
- **Progress Tracking**: Monitor quiz results and career exploration
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: ES6+ features, no frameworks
- **Local Storage**: Client-side data persistence

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

### Security
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Server-side validation
- **Password Hashing**: Secure password storage

## 📱 Pages

1. **Home** (`/`) - Landing page with hero section
2. **Login** (`/login`) - User authentication
3. **Register** (`/register`) - New user registration
4. **Dashboard** (`/dashboard`) - User's personalized dashboard
5. **Quiz** (`/quiz`) - Career assessment quiz
6. **Results** (`/result`) - Quiz results and recommendations
7. **Explorer** (`/explorer`) - Browse career options
8. **Profile** (`/profile`) - User profile management
9. **Contact** (`/contact`) - Contact form
10. **About** (`/about`) - About the platform
11. **Privacy** (`/privacy`) - Privacy policy

## 🚀 Deployment

The application is configured for deployment on Render with:
- Automatic builds from Git
- Environment variable management
- Health check endpoints
- Rate limiting for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Pramodh Kumar** - Career exploration enthusiast and full-stack developer

---

*Built with ❤️ for helping people discover their ideal career paths* 