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

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://college-connect-website.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: corsOptions
});

// Middleware for HTTP requests with CORS
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/collegeconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.io real-time notifications
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io and supabase accessible in routes
app.set('io', io);
app.set('supabase', supabase);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
