const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://pramodhkumar782006:pramodh786@cluster0.a0woy.mongodb.net/career_app?retryWrites=true&w=majority&appName=Cluster0';

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:');
      console.log('Email: test@example.com');
      console.log('Password: test123');
      console.log('Username: testuser');
      return;
    }

    // Create test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      isActive: true
    });

    console.log('Test user created successfully:');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    console.log('Username: testuser');
    console.log('User ID:', testUser._id);

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTestUser();
