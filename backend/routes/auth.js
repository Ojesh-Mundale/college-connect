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

    const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || 'http://localhost:5173';
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/confirm`,
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

    if (type !== 'signup') {
      return res.status(400).json({ message: 'Invalid confirmation type' });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      token,
      type: 'email',
    });

    if (error) {
      console.error('Supabase verify error:', error);
      return res.status(400).json({ message: 'Invalid confirmation token' });
    }

    const { user } = data;
    const { username, password } = user.user_metadata;

    // Check if user exists
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const newUser = new User({ username, email: user.email, password });
    await newUser.save();

    // Generate token
    const jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token: jwtToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        points: newUser.points
      }
    });
  } catch (error) {
    console.error('Failed to confirm email:', error);
    res.status(500).json({ message: error.message });
  }
});

// Google Sign In
router.post('/google-signin', async (req, res) => {
  try {
    const { idToken } = req.body;
    const supabase = req.app.get('supabase');

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { user } = data;

    // Check if user exists in our DB
    let dbUser = await User.findOne({ email: user.email });

    if (!dbUser) {
      // Create user if not exists
      dbUser = new User({
        username: user.user_metadata.full_name || user.email.split('@')[0],
        email: user.email,
        password: 'google-auth', // Placeholder, not used for Google auth
        avatar: user.user_metadata.avatar_url || `https://ui-avatars.com/api/?background=random&name=${user.user_metadata.full_name || user.email}`,
      });
      await dbUser.save();
    }

    // Generate token
    const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        avatar: dbUser.avatar,
        points: dbUser.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Handle email confirmation redirect
router.get('/confirm', async (req, res) => {
  try {
    const supabase = req.app.get('supabase');
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(
        `${frontendUrl}/confirm?status=error&message=${encodeURIComponent(error.message)}`
      );
    }

    const supabaseUser = data?.session?.user;

    if (!supabaseUser) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(
        `${frontendUrl}/confirm?status=error&message=No user found`
      );
    }

    // Check if user exists in our DB
    let dbUser = await User.findOne({ email: supabaseUser.email });

    if (!dbUser) {
      // Create user if not exists
      const { username, password } = supabaseUser.user_metadata;
      dbUser = new User({
        username: username || supabaseUser.email.split('@')[0],
        email: supabaseUser.email,
        password: password || 'magic-link'
      });
      await dbUser.save();
    }

    // Generate JWT token for our app
    const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(
      `${frontendUrl}/confirm?status=success&token=${token}`
    );
  } catch (err) {
    console.error('Confirmation error:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(
      `${frontendUrl}/confirm?status=error&message=${encodeURIComponent(err.message)}`
    );
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
