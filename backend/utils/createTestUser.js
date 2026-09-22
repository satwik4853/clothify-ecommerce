const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing test user
    await User.deleteOne({ email: 'test@example.com' });
    
    // Create new test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: test123');
    console.log('\nYou can now login with these credentials.');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

createTestUser();
