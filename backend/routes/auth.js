const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({ username, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send email confirmation link for registration
router.post('/send-confirmation', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const supabase = req.app.get('supabase');

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://college-connect-website.onrender.com';
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${frontendUrl}/confirm`,
        data: {
          username,
          password, // In production, hash this or use a secure method
          action: 'register'
        }
      },
    });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: 'Confirmation link sent to email' });
  } catch (error) {
    console.error('Failed to send confirmation:', error);
    res.status(500).json({ message: 'Failed to send confirmation link' });
  }
});

// Handle email confirmation callback
router.post('/confirm-email', async (req, res) => {
  try {
    const { token, type } = req.body;
    const supabase = req.app.get('supabase');

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    if (type !== 'signup') {
      return res.status(400).json({ message: 'Invalid confirmation type' });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      token,
      type: 'magiclink',
    });

    if (error) {
      console.error('Supabase verify error:', error);
      return res.status(400).json({ message: 'Invalid or expired confirmation token' });
    }

    const { user } = data;
    const { username, password } = user.user_metadata;

    // Check if user exists in our DB
    let dbUser = await User.findOne({ email: user.email });

    if (!dbUser) {
      // Create user if not exists
      dbUser = new User({
        username: username || user.email.split('@')[0],
        email: user.email,
        password: password || 'magic-link'
      });
      await dbUser.save();
    }

    // Generate JWT token for our app
    const jwtToken = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token: jwtToken,
      user: {
        id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        avatar: dbUser.avatar,
        points: dbUser.points
      }
    });
  } catch (error) {
    console.error('Failed to confirm email:', error);
    res.status(500).json({ message: error.message });
  }
});







// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
        points: req.user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
