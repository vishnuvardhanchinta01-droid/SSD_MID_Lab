import TeachingAssistant from '../models/TeachingAssistant.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const debugLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssd_mid_lab');
    console.log('Connected to MongoDB');

    const username = 'ta_demo';
    const password = 'ta123456';

    console.log('Looking for TA with username:', username);
    
    // Find TA by username or email
    const teachingAssistant = await TeachingAssistant.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    console.log('Found TA:', teachingAssistant ? 'Yes' : 'No');
    
    if (!teachingAssistant) {
      console.log('No TA found');
      
      // Let's see what TAs exist
      const allTAs = await TeachingAssistant.find({});
      console.log('All TAs in database:', allTAs.map(ta => ({ username: ta.username, email: ta.email, isActive: ta.isActive })));
      
      process.exit(0);
    }

    console.log('TA details:', {
      username: teachingAssistant.username,
      email: teachingAssistant.email,
      isActive: teachingAssistant.isActive
    });

    // Check password
    console.log('Testing password...');
    const isValidPassword = await bcrypt.compare(password, teachingAssistant.password);
    console.log('Password valid:', isValidPassword);

    if (isValidPassword) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password mismatch');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

debugLogin();
