const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');

// Import routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answers');
const commentRoutes = require('./routes/comments');
const { router: notificationRoutes } = require('./routes/notifications');
const userRoutes = require('./routes/users');

dotenv.config();

/* ================= SUPABASE CLIENT (IMPORTANT) ================= */
// ✅ MUST use SERVICE ROLE KEY on backend
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   - SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  console.error('Please set these environment variables in your deployment platform (Render).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/* ================= APP & SERVER ================= */
const app = express();
const server = http.createServer(app);

/* ================= CORS ================= */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://college-connect-website.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV === 'development'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};

/* ================= SOCKET.IO ================= */
const io = socketIo(server, {
  cors: corsOptions
});

/* ================= MIDDLEWARE ================= */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DATABASE ================= */
mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/collegeconnect',
    {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    }
  )
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) =>
    console.error('❌ MongoDB connection error:', err)
  );

mongoose.connection.on('disconnected', () =>
  console.log('⚠️ MongoDB disconnected')
);
mongoose.connection.on('reconnected', () =>
  console.log('🔄 MongoDB reconnected')
);

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

/* ================= HEALTH CHECK ================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

/* ================= SOCKET EVENTS ================= */
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

/* ================= GLOBAL OBJECTS ================= */
app.set('io', io);
app.set('supabase', supabase);

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
