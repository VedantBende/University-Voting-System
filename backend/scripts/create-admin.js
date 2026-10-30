import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import User from '../models/User.js';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const email = await question('Enter admin email (@ghru.edu.in): ');
    
    if (!email.endsWith('@ghru.edu.in')) {
      console.error('❌ Email must end with @ghru.edu.in');
      process.exit(1);
    }

    const clerkId = await question('Enter Clerk User ID (from Clerk Dashboard): ');
    const firstName = await question('Enter first name: ');
    const lastName = await question('Enter last name: ');

    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      user.role = 'admin';
      user.clerkId = clerkId;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      await user.save();
      console.log('\n✅ User updated to admin');
    } else {
      user = await User.create({
        clerkId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role: 'admin'
      });
      console.log('\n✅ Admin user created');
    }

    console.log('\n👤 Admin Details:');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Clerk ID:', user.clerkId);
    console.log('\n✅ Done!\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

createAdmin();
