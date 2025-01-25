const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./models').sequelize;
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/error');
const { Sequelize } = require('sequelize');
const sequelize = require('./models').sequelize;
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
   // origin: 'http://localhost:5173', // Allow your frontend URL
    origin: 'https://uma-7mlfqhupr-abdullah-al-fahads-projects.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
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

// Run migrations on startup
async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Run migrations
    const { exec } = require('child_process');
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.error('Migration failed:', error);
        return;
      }
      console.log('Migrations executed successfully:', stdout);
    });
  } catch (error) {
    console.error('Database connection or migration failed:', error);
  }
}

runMigrations();
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));