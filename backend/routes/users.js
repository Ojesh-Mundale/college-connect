const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get leaderboard - top users by points
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const users = await User.find({})
      .select('username avatar customAvatarSeed points createdAt')
      .sort({ points: -1, createdAt: 1 })
      .limit(parseInt(limit));

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      customAvatarSeed: user.customAvatarSeed,
      points: user.points,
      createdAt: user.createdAt
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user's rank
router.get('/rank', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('username avatar customAvatarSeed points');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count users with more points
    const usersAbove = await User.countDocuments({ points: { $gt: user.points } });

    // Count users with same points but created earlier
    const usersWithSamePoints = await User.countDocuments({
      points: user.points,
      createdAt: { $lt: user.createdAt }
    });

    const rank = usersAbove + usersWithSamePoints + 1;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        customAvatarSeed: user.customAvatarSeed,
        points: user.points
      },
      rank
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user avatar seed
router.put('/avatar-seed', auth, async (req, res) => {
  try {
    const { customAvatarSeed } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { customAvatarSeed },
      { new: true }
    ).select('username email avatar customAvatarSeed points');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        customAvatarSeed: user.customAvatarSeed,
        points: user.points
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ---------------- UPDATE ONBOARDING DETAILS ---------------- */
router.put('/onboarding', auth, async (req, res) => {
  try {
    const { fullName, grNo, department, year, collegeEmail } = req.body;

    // Validate required fields
    if (!fullName || !grNo || !department || !year || !collegeEmail) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate year
    if (year < 1 || year > 4) {
      return res.status(400).json({ message: 'Year must be between 1 and 4' });
    }

    // Update user with onboarding details
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        grNo,
        department,
        year,
        collegeEmail,
        isOnboarded: true
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        points: user.points,
        isOnboarded: user.isOnboarded
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
