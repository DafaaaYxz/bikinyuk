const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { generateAIResponse } = require('../utils/gemini');

// Get chat history for a bot
router.get('/:botId', async (req, res) => {
  try {
    const chats = await Chat.find({ botId: req.params.botId })
      .sort({ timestamp: 1 })
      .limit(50);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message to bot
router.post('/:botId/send', async (req, res) => {
  try {
    const { message, botPersona } = req.body;
    
    // Save user message
    const userMessage = new Chat({
      botId: req.params.botId,
      message,
      sender: 'user'
    });
    await userMessage.save();

    // Generate AI response
    const aiResponse = await generateAIResponse(message, botPersona);
    
    // Save bot response
    const botMessage = new Chat({
      botId: req.params.botId,
      message: aiResponse,
      sender: 'bot'
    });
    await botMessage.save();

    res.json({ userMessage, botMessage });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
});

module.exports = router;
