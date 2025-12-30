const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

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
        points: user.points
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
        points: dbUser.points
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
      points: req.user.points
    }
  });
});

module.exports = router;
