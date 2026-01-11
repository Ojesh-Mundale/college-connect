const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/* ---------------- REGISTER ---------------- */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, contactNumber, branch, collegeName } = req.body;

    // Validate required fields
    if (!username || !email || !password || !contactNumber || !branch || !collegeName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Generate confirmation token with registration data (don't create user yet)
    const confirmationToken = jwt.sign(
      {
        username,
        email,
        password,
        contactNumber,
        branch,
        collegeName,
        type: 'registration'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // For development/testing - log the confirmation URL
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/confirm?token=${confirmationToken}`;
    console.log('✅ Registration successful!');
    console.log('🔗 Confirmation URL (for testing):', confirmationUrl);
    console.log('📧 In production, this URL would be emailed to:', email);

    // TODO: Implement actual email sending service (SendGrid, AWS SES, etc.)
    // For now, users can copy the confirmation URL from the console to test

    res.status(201).json({
      message: 'Registration successful! Please check your email to confirm your account.',
      requiresConfirmation: true
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

/* ---------------- CONFIRM EMAIL ---------------- */
router.post('/confirm', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Confirmation token is required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if this is a registration confirmation (new flow)
    if (decoded.type === 'registration') {
      // Create the user from the token data
      const user = new User({
        username: decoded.username,
        email: decoded.email,
        password: decoded.password,
        contactNumber: decoded.contactNumber,
        branch: decoded.branch,
        collegeName: decoded.collegeName
      });

      await user.save();

      // Generate JWT token for login
      const loginToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token: loginToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          customAvatarSeed: user.customAvatarSeed,
          points: user.points,
          isOnboarded: user.isOnboarded,
          fullName: user.fullName,
          contactNumber: user.contactNumber,
          branch: user.branch,
          year: user.year,
          collegeName: user.collegeName
        },
        message: 'Email confirmed successfully! Your account has been created.'
      });
    } else {
      // Legacy flow - find existing user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate JWT token for login
      const loginToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token: loginToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          customAvatarSeed: user.customAvatarSeed,
          points: user.points,
          isOnboarded: user.isOnboarded,
          fullName: user.fullName,
          contactNumber: user.contactNumber,
          branch: user.branch,
          year: user.year,
          collegeName: user.collegeName
        },
        message: 'Email confirmed successfully!'
      });
    }
  } catch (err) {
    console.error('Confirmation error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Confirmation link has expired. Please register again.' });
    }
    res.status(400).json({ message: 'Invalid confirmation token' });
  }
});

/* ---------------- LOGIN ---------------- */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        customAvatarSeed: user.customAvatarSeed,
        points: user.points,
        isOnboarded: user.isOnboarded,
        fullName: user.fullName,
        contactNumber: user.contactNumber,
        branch: user.branch,
        year: user.year,
        collegeName: user.collegeName
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GOOGLE LOGIN ---------------- */
router.post('/google', async (req, res) => {
  try {
    console.log('Google login request received:', req.body);

    const { user: googleUser } = req.body;

    if (!googleUser || !googleUser.email) {
      console.log('Invalid user data:', googleUser);
      return res.status(400).json({ message: 'User data required' });
    }

    console.log('Looking for existing user with email:', googleUser.email);
    let dbUser = await User.findOne({ email: googleUser.email });

    if (!dbUser) {
      let baseUsername = googleUser.user_metadata?.full_name
        || googleUser.email.split('@')[0];

      console.log('Creating new user with base username:', baseUsername);

      // Handle duplicate usernames by appending a number
      let username = baseUsername;
      let counter = 1;
      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      console.log('Final username:', username);

      dbUser = new User({
        username: username,
        email: googleUser.email,
        password: 'google-oauth'
      });
      await dbUser.save();
      console.log('User created successfully:', dbUser._id);
    } else {
      console.log('Existing user found:', dbUser._id);
    }

    const token = jwt.sign(
      { id: dbUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('JWT token generated, sending response');

    res.json({
      token,
      user: {
        id: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        avatar: dbUser.avatar,
        points: dbUser.points,
        isOnboarded: dbUser.isOnboarded,
        fullName: dbUser.fullName,
        contactNumber: dbUser.contactNumber,
        branch: dbUser.branch,
        year: dbUser.year,
        collegeName: dbUser.collegeName
      }
    });

  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ message: 'Google login failed' });
  }
});

/* ---------------- CURRENT USER ---------------- */
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      customAvatarSeed: req.user.customAvatarSeed,
      points: req.user.points,
      isOnboarded: req.user.isOnboarded,
      fullName: req.user.fullName,
      contactNumber: req.user.contactNumber,
      branch: req.user.branch,
      year: req.user.year,
      collegeName: req.user.collegeName
    }
  });
});

/* ---------------- CONFIRM DEV (Development Mode) ---------------- */
router.post('/confirm-dev', async (req, res) => {
  try {
    // For development mode, create a test user account
    // In production, this would require proper email verification

    // Create a test user (you can modify these values as needed)
    const testUser = new User({
      username: 'testuser' + Date.now(), // Unique username
      email: 'test@example.com',
      password: 'password123', // This will be hashed by pre-save middleware
      contactNumber: '1234567890',
      branch: 'Computer Science',
      collegeName: 'Test College'
    });

    await testUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: testUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: testUser._id,
        username: testUser.username,
        email: testUser.email,
        avatar: testUser.avatar,
        points: testUser.points,
        isOnboarded: testUser.isOnboarded,
        fullName: testUser.fullName,
        contactNumber: testUser.contactNumber,
        branch: testUser.branch,
        year: testUser.year,
        collegeName: testUser.collegeName
      }
    });

  } catch (err) {
    console.error('Dev confirmation error:', err);
    res.status(500).json({ message: 'Failed to create account' });
  }
});

module.exports = router;
