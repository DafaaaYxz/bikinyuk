const express = require('express');
const router = express.Router();
const Bot = require('../models/Bot');

// Get all public bots
router.get('/', async (req, res) => {
  try {
    const bots = await Bot.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new bot
router.post('/', async (req, res) => {
  try {
    const { name, description, persona, profileImage, creator } = req.body;
    
    const bot = new Bot({
      name,
      description,
      persona,
      profileImage,
      creator: creator || 'Anonymous'
    });

    await bot.save();
    res.status(201).json(bot);
  } catch (error) {
    res.status(400).json({ error: 'Error creating bot' });
  }
});

// Get bot by ID
router.get('/:id', async (req, res) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    res.json(bot);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
