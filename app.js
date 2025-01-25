const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./models').sequelize;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/error');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allow all origins for CORS
app.use(cors({
  origin: '*', // Allow any domain to access the server
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true,
}));

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: '*', // Allow any domain to connect to Socket.IO
    methods: ['GET', 'POST'], // Allow only GET and POST for Socket.IO
  },
});

// Middleware
app.use(express.json());

// Database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));