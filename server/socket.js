const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

const onlineUsers = new Map();

function initSocket(io) {
  console.log('Socket.io initialized');
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Authenticate user
    socket.on('join', async (token) => {
      console.log('Join attempt from:', socket.id);
      try {
        if (!token) {
          console.log('No token provided');
          return socket.disconnect();
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('name');
        if (!user) {
          console.log('User not found');
          return socket.disconnect();
        }

        socket.userId = user._id.toString();
        socket.username = user.name;
        onlineUsers.set(socket.userId, { username: user.name, socketId: socket.id });

        console.log(user.name, 'authenticated');
        socket.emit('authenticated', { username: user.name });
        io.emit('onlineUsers', Array.from(onlineUsers.values()).map(u => u.username));
      } catch (err) {
        console.error('Auth error:', err.message);
        socket.disconnect();
      }
    });

    // Send message
    socket.on('sendMessage', async (data) => {
      if (!socket.userId || !data.message?.trim()) return;

      try {
        const message = await Message.create({
          userId: socket.userId,
          username: socket.username,
          message: data.message.trim()
        });

        await message.populate('userId', 'name');

        io.emit('newMessage', {
          _id: message._id,
          userId: message.userId,
          username: socket.username,
          message: message.message,
          timestamp: message.timestamp
        });
      } catch (err) {
        console.error('Message save error:', err);
      }
    });

    // Typing indicator
    socket.on('typing', () => {
      if (socket.username) {
        socket.broadcast.emit('userTyping', socket.username);
      }
    });

    socket.on('stopTyping', () => {
      socket.broadcast.emit('userStopTyping');
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('onlineUsers', Array.from(onlineUsers.values()).map(u => u.username));
        console.log(`${socket.username} left the chat`);
      }
    });
  });
}

module.exports = initSocket;
