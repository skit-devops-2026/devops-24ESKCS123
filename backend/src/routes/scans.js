const express = require('express');
const mongoose = require('mongoose');
const Scan = require('../models/Scan');
const { requireAuth } = require('../auth');

const router = express.Router();

const riskLevels = new Set(['No input', 'Low risk', 'Medium risk', 'High risk']);

function cleanString(value) {
  return String(value || '').trim();
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

router.use(requireAuth);

router.post('/', async (request, response, next) => {
  try {
    const inputText = cleanString(request.body.inputText);
    const summary = cleanString(request.body.summary);
    const riskLevel = cleanString(request.body.riskLevel);
    const score = Number(request.body.score);
    const title = cleanString(request.body.title) || `Scan ${new Date().toISOString().slice(0, 10)}`;
    const flags = request.body.flags || [];
    const recommendations = request.body.recommendations || [];

    if (!inputText) {
      response.status(400).json({ error: 'inputText is required' });
      return;
    }

    if (!Number.isFinite(score) || score < 0 || score > 100) {
      response.status(400).json({ error: 'score must be a number between 0 and 100' });
      return;
    }

    if (!riskLevels.has(riskLevel)) {
      response.status(400).json({ error: 'riskLevel is invalid' });
      return;
    }

    if (!summary) {
      response.status(400).json({ error: 'summary is required' });
      return;
    }

    if (!isStringArray(flags) || !isStringArray(recommendations)) {
      response.status(400).json({ error: 'flags and recommendations must be arrays of strings' });
      return;
    }

    const scan = await Scan.create({
      userId: request.userId,
      inputText,
      score,
      riskLevel,
      summary,
      flags,
      recommendations,
      title,
      pinned: false,
    });

    response.status(201).json({ scan });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (request, response, next) => {
  try {
    const scans = await Scan.find({ userId: request.userId }).sort({ createdAt: -1 });
    response.json({ scans });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(404).json({ error: 'Scan not found' });
      return;
    }

    const scan = await Scan.findOne({ _id: request.params.id, userId: request.userId });

    if (!scan) {
      response.status(404).json({ error: 'Scan not found' });
      return;
    }

    response.json({ scan });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(404).json({ error: 'Scan not found' });
      return;
    }

    const updates = {};

    if (typeof request.body.title === 'string') {
      const title = request.body.title.trim();
      if (!title) {
        response.status(400).json({ error: 'title cannot be empty' });
        return;
      }
      updates.title = title;
    }

    if (typeof request.body.pinned === 'boolean') {
      updates.pinned = request.body.pinned;
    }

    if (Object.keys(updates).length === 0) {
      response.status(400).json({ error: 'No valid fields to update' });
      return;
    }

    const scan = await Scan.findOneAndUpdate(
      { _id: request.params.id, userId: request.userId },
      updates,
      { new: true },
    );

    if (!scan) {
      response.status(404).json({ error: 'Scan not found' });
      return;
    }

    response.json({ scan });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      response.status(404).json({ error: 'Scan not found' });
      return;
    }

    const deleted = await Scan.findOneAndDelete({ _id: request.params.id, userId: request.userId });
    if (!deleted) {
      response.status(404).json({ error: 'Scan not found' });
      return;
    }

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
