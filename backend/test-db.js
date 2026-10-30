import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testDB = async () => {
  try {
    console.log('🧪 Testing MongoDB connection...\n');

    // Connect
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/university-voting';
    console.log('Connecting to:', mongoURI);
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected!\n');

    // Create test schema
    const TestSchema = new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    });
    const Test = mongoose.model('Test', TestSchema);

    // Insert
    console.log('📝 Inserting test document...');
    const doc = await Test.create({ message: 'Hello from test!' });
    console.log('✅ Inserted:', doc);

    // Find
    console.log('\n🔍 Finding test document...');
    const found = await Test.findOne({ message: 'Hello from test!' });
    console.log('✅ Found:', found);

    // Delete
    console.log('\n🗑️  Deleting test document...');
    await Test.deleteMany({});
    console.log('✅ Deleted\n');

    console.log('🎉 All database operations work!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
};

testDB();
