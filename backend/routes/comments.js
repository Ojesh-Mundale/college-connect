const express = require('express');
const Comment = require('../models/Comment');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      question: req.params.questionId,
      answer: null 
    })
      .populate('author', 'username avatar points')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comments for an answer
router.get('/answer/:answerId', async (req, res) => {
  try {
    const comments = await Comment.find({ 
      answer: req.params.answerId 
    })
      .populate('author', 'username avatar points')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create comment
router.post('/', auth, async (req, res) => {
  try {
    const { content, questionId, answerId } = req.body;

    const comment = new Comment({
      content,
      author: req.user._id,
      question: questionId,
      answer: answerId || null
    });

    await comment.save();
    await comment.populate('author', 'username avatar points');

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update comment
router.put('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    await comment.populate('author', 'username avatar points');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upvote comment
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userIndex = comment.upvotes.indexOf(req.user._id);
    
    if (userIndex > -1) {
      comment.upvotes.splice(userIndex, 1);
    } else {
      comment.upvotes.push(req.user._id);
    }

    await comment.save();

    res.json({ upvotes: comment.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify AI answer
router.post('/verify-ai/:answerId', auth, async (req, res) => {
  try {
    const { isCorrect, feedback } = req.body;
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (!answer.isAI) {
      return res.status(400).json({ message: 'This is not an AI answer' });
    }

    // Create verification record
    const verification = {
      user: req.user._id,
      isCorrect,
      feedback,
      createdAt: new Date()
    };

    // Update answer with verification
    answer.verifications = answer.verifications || [];
    answer.verifications.push(verification);
    await answer.save();

    res.json({ message: 'Verification recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
