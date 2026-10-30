import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import connectDB from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { autoRevealResults, updateElectionStatus } from './utils/timer.js';

// ============================================
// LOAD ENVIRONMENT VARIABLES
// ============================================
dotenv.config();

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🎓 UNIVERSITY VOTING SYSTEM - BACKEND SERVER             ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ============================================
// VERIFY ENVIRONMENT VARIABLES
// ============================================
console.log('🔍 Checking Environment Variables...\n');

const envStatus = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI ? '✓ Set' : '✗ Missing',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? '✓ Set' : '✗ Missing',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ALLOWED_EMAIL_DOMAIN: process.env.ALLOWED_EMAIL_DOMAIN || 'ghru.edu.in'
};

console.log('Environment Configuration:');
console.log(`  NODE_ENV: ${envStatus.NODE_ENV}`);
console.log(`  PORT: ${envStatus.PORT}`);
console.log(`  MONGODB_URI: ${envStatus.MONGODB_URI}`);
console.log(`  CLERK_SECRET_KEY: ${envStatus.CLERK_SECRET_KEY}`);
console.log(`  CLIENT_URL: ${envStatus.CLIENT_URL}`);
console.log(`  ALLOWED_EMAIL_DOMAIN: ${envStatus.ALLOWED_EMAIL_DOMAIN}`);
console.log('');

// Warnings for missing critical variables
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  WARNING: MONGODB_URI not set, using default: mongodb://127.0.0.1:27017/university-voting');
}
if (!process.env.CLERK_SECRET_KEY) {
  console.warn('⚠️  WARNING: CLERK_SECRET_KEY not set, some features will not work');
}

// ============================================
// INITIALIZE EXPRESS APP
// ============================================
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CONNECT TO DATABASE
// ============================================
connectDB().catch(err => {
  console.error('❌ Failed to connect to database:', err.message);
  process.exit(1);
});

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================
console.log('⚙️  Setting up middleware...\n');

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware (Development Only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// IMPORT ROUTES
// ============================================
import authRoutes from './routes/auth.routes.js';
import electionRoutes from './routes/election.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import voteRoutes from './routes/vote.routes.js';
import adminRoutes from './routes/admin.routes.js';

// ============================================
// API ROUTES
// ============================================
console.log('🛣️  Registering API routes...\n');

app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/admin', adminRoutes);

console.log('  ✓ /api/auth');
console.log('  ✓ /api/elections');
console.log('  ✓ /api/candidates');
console.log('  ✓ /api/votes');
console.log('  ✓ /api/admin');
console.log('');

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '🎓 University Voting System API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: 'Connected',
    uptime: process.uptime(),
    allowedDomain: process.env.ALLOWED_EMAIL_DOMAIN || 'ghru.edu.in'
  });
});

// ============================================
// API INFO ENDPOINT
// ============================================
app.get('/api', (req, res) => {
  res.json({
    name: 'University Voting System API',
    version: '1.0.0',
    description: 'Secure, anonymous voting system for university elections',
    status: 'Running',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        sync: 'POST /api/auth/sync',
        checkUser: 'POST /api/auth/check-user',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile',
        makeAdmin: 'POST /api/auth/make-admin (DEV ONLY)',
        allUsers: 'GET /api/auth/users/all (DEV ONLY)'
      },
      elections: {
        list: 'GET /api/elections',
        getById: 'GET /api/elections/:id',
        create: 'POST /api/elections',
        update: 'PUT /api/elections/:id',
        delete: 'DELETE /api/elections/:id'
      },
      candidates: {
        byElection: 'GET /api/candidates/election/:electionId',
        getById: 'GET /api/candidates/:id',
        create: 'POST /api/candidates',
        update: 'PUT /api/candidates/:id',
        delete: 'DELETE /api/candidates/:id'
      },
      votes: {
        submit: 'POST /api/votes/submit',
        status: 'GET /api/votes/status/:electionId',
        results: 'GET /api/votes/results/:electionId'
      }
    },
    authentication: 'Clerk + Bearer Token',
    restrictions: `Only @${process.env.ALLOWED_EMAIL_DOMAIN || 'ghru.edu.in'} emails allowed`
  });
});

// ============================================
// ROOT ENDPOINT
// ============================================
app.get('/', (req, res) => {
  res.json({
    message: '🎓 University Voting System API',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api',
    health: '/api/health'
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist.',
    availableEndpoints: '/api'
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use(errorHandler);

// ============================================
// SCHEDULE CRON JOBS
// ============================================
console.log('⏰ Setting up scheduled tasks...\n');

// Run every minute to check election status and reveal results
cron.schedule('* * * * *', () => {
  if (process.env.NODE_ENV === 'development') {
    const now = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[${now}] Running scheduled tasks...`);
  }
  updateElectionStatus();
  autoRevealResults();
});

console.log('  ✓ Election status updater (every minute)');
console.log('  ✓ Results auto-reveal (every minute)');
console.log('');

// ============================================
// GRACEFUL SHUTDOWN HANDLER
// ============================================
const gracefulShutdown = () => {
  console.log('\n\n🛑 Received shutdown signal...');
  console.log('Closing server gracefully...');
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    console.log('Closing database connection...');
    
    import('mongoose').then(mongoose => {
      mongoose.default.connection.close().then(() => {
        console.log('✅ Database connection closed');
        console.log('👋 Process terminated gracefully\n');
        process.exit(0);
      });
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                    🚀 SERVER STARTED                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`📊 API URL:          http://localhost:${PORT}/api`);
  console.log(`💚 Health Check:     http://localhost:${PORT}/api/health`);
  console.log(`🏠 Root:             http://localhost:${PORT}/`);
  console.log('');
  console.log('📝 Available Endpoints:');
  console.log(`   GET  ${PORT}/api               - API documentation`);
  console.log(`   GET  ${PORT}/api/health        - Health check`);
  console.log(`   POST ${PORT}/api/auth/*        - Authentication routes`);
  console.log(`   GET  ${PORT}/api/elections/*   - Election routes`);
  console.log(`   GET  ${PORT}/api/candidates/*  - Candidate routes`);
  console.log(`   POST ${PORT}/api/votes/*       - Voting routes`);
  console.log('');
  console.log('💡 Press Ctrl+C to stop the server\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
});

// ============================================
// PROCESS EVENT HANDLERS
// ============================================

// Handle SIGTERM (Kubernetes, Docker)
process.on('SIGTERM', gracefulShutdown);

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', gracefulShutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('\n❌ UNHANDLED PROMISE REJECTION:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('\nShutting down server...\n');
  gracefulShutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\n❌ UNCAUGHT EXCEPTION:');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('\nShutting down server...\n');
  gracefulShutdown();
});

export default app;
