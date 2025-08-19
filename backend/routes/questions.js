const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateAIAnswer } = require('../services/aiService');

const router = express.Router();

// Get all questions
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, subject, grade, search, author } = req.query;
    
    const query = {};
    if (subject) query.subject = subject;
    if (grade) query.grade = grade;
    if (author) query.author = author;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(query)
      .populate('author', 'username avatar')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get questions by user email
router.get('/user/:email', auth, async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.params.email });
    
    if (!user) {
      return res.json([]); // Return empty array if user not found
    }

    // Find questions by user ID
    const questions = await Question.find({ author: user._id })
      .populate('author', 'username avatar email')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${questions.length} questions for user ${user.email}`);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single question
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar'
        }
      });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment views
    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create question
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, subject, branch, year, tags, points } = req.body;

    // Validate points
    const questionPoints = Math.max(1, parseInt(points) || 1);
    
    // Check if user has enough points
    const user = await User.findById(req.user._id);
    if (user.points < questionPoints) {
      return res.status(400).json({ 
        message: `Insufficient points. You need ${questionPoints} points to ask this question. Current points: ${user.points}` 
      });
    }

    const question = new Question({
      title,
      content,
      subject,
      branch,
      year,
      tags: tags || [],
      points: questionPoints,
      author: req.user._id
    });

    await question.save();

    // Deduct points from user
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: -questionPoints } });

    // Generate AI answer
    try {
      const aiAnswer = await generateAIAnswer(title, content, subject, branch, year);
      question.aiAnswer = aiAnswer;
      await question.save();
    } catch (aiError) {
      console.error('AI generation failed:', aiError);
    }

    await question.populate('author', 'username avatar');

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update question
router.put('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, subject, grade, tags } = req.body;
    
    question.title = title || question.title;
    question.content = content || question.content;
    question.subject = subject || question.subject;
    question.grade = grade || question.grade;
    question.tags = tags || question.tags;

    await question.save();
    await question.populate('author', 'username avatar');

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Answer.deleteMany({ question: req.params.id });
    await Question.findByIdAndDelete(req.params.id);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upvote question
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const userIndex = question.upvotes.indexOf(req.user._id);
    
    if (userIndex > -1) {
      question.upvotes.splice(userIndex, 1);
    } else {
      question.upvotes.push(req.user._id);
    }

    await question.save();
    res.json({ upvotes: question.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Resolve question
router.post('/:id/resolve', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.isResolved = true;
    await question.save();

    res.json({ message: 'Question marked as resolved', question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unresolve question
router.post('/:id/unresolve', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.isResolved = false;
    await question.save();

    res.json({ message: 'Question marked as unresolved', question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
