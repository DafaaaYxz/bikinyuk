const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/ai-bots', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Routes
app.use('/api/bots', require('./routes/bots'));
app.use('/api/chat', require('./routes/chat'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/create-bot', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/create-bot.html'));
});

app.get('/chat/:botId', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chat.html'));
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-chat', (botId) => {
    socket.join(botId);
  });

  socket.on('send-message', async (data) => {
    try {
      const Chat = require('./models/Chat');
      const newMessage = new Chat({
        botId: data.botId,
        message: data.message,
        sender: data.sender,
        timestamp: new Date()
      });
      await newMessage.save();

      // Broadcast to all users in the room
      io.to(data.botId).emit('new-message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
