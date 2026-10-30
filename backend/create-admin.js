import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔧 Creating admin user...\n');

    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/university-voting';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const adminEmail = 'admin@ghru.edu.in'; // Change this to your email
    
    // Check if user exists
    let user = await User.findOne({ email: adminEmail });
    
    if (user) {
      console.log('📝 User exists, updating role...');
      user.role = 'admin';
      await user.save();
      console.log('✅ Updated to admin');
    } else {
      console.log('📝 Creating new admin user...');
      user = await User.create({
        clerkId: 'temp_admin_' + Date.now(),
        email: adminEmail,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }

    console.log('\n👤 Admin User:');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   ID:', user._id);
    console.log('\n🎉 Done!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
