# Career Suggestion App

A comprehensive career exploration and assessment platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Career Assessment Quiz** - Interactive personality and skill assessment
- **Career Explorer** - Browse and discover various career paths
- **User Dashboard** - Personalized results and recommendations
- **Modern UI** - Responsive design with glassmorphism effects
- **Full-width Sections** - Spacious and professional layouts
- **Contact & About Pages** - Complete information pages
- **Forgot Password** - Password recovery functionality
- **Privacy Policy** - Comprehensive privacy information

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Security**: Helmet, CORS, Rate Limiting
- **Authentication**: JWT, bcryptjs

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pramodh7860/career-suggestion.git
   cd career-suggestion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration:
   ```
   PORT=3000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## 🌐 Deployment Options

### Option 1: Render (Recommended - Free)

1. **Sign up at [Render.com](https://render.com)**
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Configure the service:**
   - **Name**: career-suggestion-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   - `NODE_ENV`: production
   - `PORT`: 3000
   - `MONGODB_URI`: your_mongodb_connection_string
   - `JWT_SECRET`: your_jwt_secret

6. **Deploy!** Your app will be available at `https://your-app-name.onrender.com`

### Option 2: Railway

1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Add environment variables**
4. **Deploy automatically**

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Add environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

5. **Deploy**
   ```bash
   git push heroku master
   ```

### Option 4: Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure build settings**
4. **Add environment variables**
5. **Deploy**

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 24h |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 📁 Project Structure

```
career-suggestion/
├── routes/           # API routes
├── models/           # MongoDB models
├── middleware/       # Custom middleware
├── scripts/          # Database seeding
├── *.html           # Frontend pages
├── *.css            # Stylesheets
├── *.js             # Frontend scripts
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

## 🎨 Features Overview

### Pages
- **Home** (`/`) - Landing page with career exploration
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **Dashboard** (`/dashboard`) - User dashboard with results
- **Explorer** (`/explorer`) - Career browsing
- **Quiz** (`/quiz`) - Assessment questionnaire
- **Result** (`/result`) - Quiz results
- **Contact** (`/contact`) - Contact information
- **About** (`/about`) - About the platform
- **Privacy** (`/privacy`) - Privacy policy
- **Forgot Password** (`/forgot-password`) - Password recovery

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/careers` - Get all careers
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/users/profile` - Get user profile

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API request limiting
- **Input Validation** - Request validation
- **Password Hashing** - bcryptjs encryption
- **JWT Authentication** - Token-based auth

## 🚀 Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/pramodh7860/career-suggestion.git
   cd career-suggestion
   npm install
   ```

2. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URI
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Visit** `http://localhost:3000`

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Pramodh Kumar**
- GitHub: [@pramodh7860](https://github.com/pramodh7860)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help with deployment, please open an issue on GitHub. 