# Career Compass - Career Exploration Platform

A comprehensive career exploration and assessment platform built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Career Assessment Quiz**: Interactive personality and skills assessment
- **Career Recommendations**: AI-powered career matching based on quiz results
- **Career Explorer**: Browse and search through detailed career information
- **Skills Database**: Comprehensive skills required for each career path
- **User Dashboard**: Track progress, quiz history, and saved careers
- **Responsive Design**: Modern UI that works on all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **HTML5 & CSS3** - Modern responsive design
- **Google Fonts** - Typography
- **CSS Grid & Flexbox** - Layout system

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-app-vanilla
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://pramodhkumar782006:pramodh786@cluster0.a0woy.mongodb.net/career_app?retryWrites=true&w=majority&appName=Cluster0
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # Security
   BCRYPT_ROUNDS=12
   ```

4. **Seed the database**
   ```bash
   node scripts/seedCareers.js
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

### User Model
- Basic info (username, email, password, name)
- Profile data (interests, date of birth)
- Quiz results and career recommendations
- Saved careers list
- Account status and verification

### QuizResult Model
- User quiz responses and scores
- Career recommendations with match percentages
- Completion time and feedback
- Personality trait analysis

### Career Model
- Comprehensive career information
- Skills, salary ranges, requirements
- Company recommendations and resources
- Personality trait matching

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Quiz
- `POST /api/quiz/submit` - Submit quiz results
- `GET /api/quiz/history` - Get quiz history
- `GET /api/quiz/:id` - Get specific quiz result

### Careers
- `GET /api/careers` - Get all careers (with filtering)
- `GET /api/careers/:id` - Get specific career
- `GET /api/careers/categories` - Get career categories
- `GET /api/careers/popular` - Get popular careers
- `POST /api/careers/:id/save` - Save career to user list
- `DELETE /api/careers/:id/save` - Remove career from list
- `GET /api/careers/saved` - Get user's saved careers
- `GET /api/careers/by-traits` - Get careers by personality traits
- `GET /api/careers/:id/similar` - Get similar careers

### Users
- `GET /api/users/dashboard` - Get dashboard data
- `GET /api/users/quiz-results` - Get user's quiz results
- `GET /api/users/saved-careers` - Get saved careers
- `GET /api/users/recommendations` - Get career recommendations
- `GET /api/users/progress` - Get progress statistics
- `DELETE /api/users/account` - Delete user account
- `GET /api/users/export` - Export user data

## 🎯 Features in Detail

### Career Assessment Quiz
- 30 questions covering 6 personality dimensions
- Real-time scoring and analysis
- Personalized career recommendations
- Detailed reasoning for each recommendation

### Career Explorer
- Search and filter careers by category
- Detailed career information with skills
- Salary ranges and requirements
- Company recommendations and resources

### User Dashboard
- Progress tracking and statistics
- Quiz history and results
- Saved careers management
- Skill development visualization

### Skills Database
- 8+ skills per career path
- Detailed skill descriptions
- Learning resources and certifications
- Industry-specific requirements

## 🔒 Security Features

- **Password Hashing**: bcryptjs with 12 rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Helmet Security**: HTTP headers protection

## 📱 Responsive Design

- Mobile-first approach
- CSS Grid and Flexbox layouts
- Smooth animations and transitions
- Touch-friendly interactions
- Cross-browser compatibility

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
Make sure to set the following in production:
- `NODE_ENV=production`
- `JWT_SECRET` (use a strong secret)
- `MONGODB_URI` (your production database)

## 📈 Performance

- **Database Indexing**: Optimized queries with proper indexes
- **Compression**: Gzip compression for responses
- **Caching**: Efficient data retrieval
- **Pagination**: Large dataset handling
- **Error Handling**: Comprehensive error management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments

## 🎉 Acknowledgments

- MongoDB Atlas for database hosting
- Google Fonts for typography
- The career development community for insights

---

**Built with ❤️ for career exploration and development** 