import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment or use default
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/university-voting';
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', mongoURI.split('@')[1] || mongoURI);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Connect with options
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📦 Host:', conn.connection.host);
    console.log('📂 Database:', conn.connection.name);
    console.log('🔌 Port:', conn.connection.port);
    
    // List collections
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('📚 Collections:', collections.length > 0 
        ? collections.map(c => c.name).join(', ')
        : 'None (will be created when data is inserted)');
    } catch (listError) {
      console.log('📚 Collections: Unable to list (will be created on first insert)');
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return conn;
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is installed');
    console.error('   2. Start MongoDB service:');
    console.error('      Windows: net start MongoDB');
    console.error('      macOS: brew services start mongodb-community');
    console.error('      Linux: sudo systemctl start mongod');
    console.error('   3. Check if MongoDB is running on port 27017');
    console.error('   4. Try connecting with: mongosh');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Exit process
    process.exit(1);
  }
};

// Connection event handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose: Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose: Connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose: Disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Mongoose: Connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
