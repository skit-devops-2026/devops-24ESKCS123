const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { createToken, requireAuth, toPublicUser } = require('../auth');

const router = express.Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[a-zA-Z\s.'-]+$/;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

router.post('/signup', async (request, response, next) => {
  try {
    const fullName = String(request.body.fullName || '').trim();
    const email = normalizeEmail(request.body.email);
    const password = String(request.body.password || '');
    const goal = String(request.body.goal || '').trim();
    const updates = Boolean(request.body.updates);

    if (!fullName || fullName.length < 2 || !namePattern.test(fullName)) {
      response.status(400).json({ error: 'Invalid full name' });
      return;
    }

    if (!emailPattern.test(email)) {
      response.status(400).json({ error: 'Invalid email address' });
      return;
    }

    if (!isValidPassword(password)) {
      response.status(400).json({ error: 'Password must be at least 8 characters and include letters and numbers' });
      return;
    }

    if (!['check_job_offers', 'get_scam_alerts', 'career_support', 'other'].includes(goal)) {
      response.status(400).json({ error: 'Invalid goal selected' });
      return;
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      response.status(409).json({ error: 'Email is already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ fullName, email, passwordHash, goal, updates });
    const token = createToken(user._id);

    response.status(201).json({ user: toPublicUser(user), token });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (request, response, next) => {
  try {
    const email = normalizeEmail(request.body.email);
    const password = String(request.body.password || '');

    if (!emailPattern.test(email) || !password) {
      response.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      response.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      response.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = createToken(user._id);
    response.json({ user: toPublicUser(user), token });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, async (request, response, next) => {
  try {
    const user = await User.findById(request.userId);

    if (!user) {
      response.status(404).json({ error: 'User not found' });
      return;
    }

    response.json({ user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.patch('/me', requireAuth, async (request, response, next) => {
  try {
    const updates = {};

    if (typeof request.body.fullName === 'string') {
      const fullName = request.body.fullName.trim();
      if (!fullName || fullName.length < 2 || !namePattern.test(fullName)) {
        response.status(400).json({ error: 'Invalid full name' });
        return;
      }
      updates.fullName = fullName;
    }

    if (typeof request.body.goal === 'string') {
      if (!['check_job_offers', 'get_scam_alerts', 'career_support', 'other'].includes(request.body.goal)) {
        response.status(400).json({ error: 'Invalid goal selected' });
        return;
      }
      updates.goal = request.body.goal;
    }

    if (typeof request.body.updates === 'boolean') {
      updates.updates = request.body.updates;
    }

    if (Object.keys(updates).length === 0) {
      response.status(400).json({ error: 'No valid fields to update' });
      return;
    }

    const user = await User.findByIdAndUpdate(request.userId, updates, { new: true });

    if (!user) {
      response.status(404).json({ error: 'User not found' });
      return;
    }

    response.json({ user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
