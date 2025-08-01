const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pramodhkumar782006:pramodh786@cluster0.a0woy.mongodb.net/career_app?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📊 Database: career_app');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files with proper MIME types
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/careers', require('./routes/careers'));

// Serve HTML files with proper error handling
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'login.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving login.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/register', (req, res) => {
  const filePath = path.join(__dirname, 'register.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving register.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/dashboard', (req, res) => {
  const filePath = path.join(__dirname, 'dashboard.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving dashboard.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/explorer', (req, res) => {
  const filePath = path.join(__dirname, 'explorer.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving explorer.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/quiz', (req, res) => {
  const filePath = path.join(__dirname, 'quiz.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving quiz.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/result', (req, res) => {
  const filePath = path.join(__dirname, 'result.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving result.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/contact', (req, res) => {
  const filePath = path.join(__dirname, 'contact.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving contact.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/about', (req, res) => {
  const filePath = path.join(__dirname, 'about.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving about.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/privacy', (req, res) => {
  const filePath = path.join(__dirname, 'privacy.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving privacy.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

app.get('/forgot-password', (req, res) => {
  const filePath = path.join(__dirname, 'forgot-password.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving forgot-password.html:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Career Suggestion App is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - serve index.html for SPA routing
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  
  // If it's an API request, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false, 
      message: 'API endpoint not found' 
    });
  }
  
  // For frontend routes, serve index.html (SPA fallback)
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving index.html for 404:', err);
      res.status(404).send('Page not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📱 App URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
}); 