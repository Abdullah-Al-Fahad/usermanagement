const express = require('express');
const { User } = require('../models');
const authMiddleware = require('../middleware/auth');
const createError = require('http-errors');

const router = express.Router();

// Get all users
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    console.log('Fetching all users'); // Debug log
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'lastLogin', 'status', 'registrationTime'],
      order: [['lastLogin', 'DESC']],
    });
    console.log('Users fetched successfully:', users); // Debug log
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message); // Debug log
    next(createError(500, error.message));
  }
});

// Block users
router.post('/block', authMiddleware, async (req, res, next) => {
  try {
    const { userIds } = req.body;
    console.log('Blocking users with IDs:', userIds); // Debug log

    // Fetch users who are active
    const activeUsers = await User.findAll({
      where: { id: userIds, status: 'active' },
      attributes: ['id'],
    });

    const activeUserIds = activeUsers.map((user) => user.id);

    if (activeUserIds.length === 0) {
      return res.status(400).json({
        message: 'Please Select Active Users To Block',
      });
    }

    // Update only active users to 'blocked'
    await User.update({ status: 'blocked' }, { where: { id: activeUserIds } });
    console.log('Users blocked successfully:', activeUserIds); // Debug log

    // Emit event to all clients
    const io = req.app.get('io');
    if (io) {
      io.emit('usersUpdated', { action: 'block', userIds: activeUserIds });
      console.log('Emitted usersUpdated event:', { action: 'block', userIds: activeUserIds }); // Debug log
    } else {
      console.error('Socket.IO instance (io) is not available'); // Debug log
    }

    res.json({ message: 'Users blocked successfully', blockedUserIds: activeUserIds });
  } catch (error) {
    console.error('Error blocking users:', error.message); // Debug log
    next(createError(500, error.message));
  }
});

// Unblock users
router.post('/unblock', authMiddleware, async (req, res, next) => {
  try {
    const { userIds } = req.body;
    console.log('Unblocking users with IDs:', userIds); // Debug log

    // Fetch users who are blocked
    const blockedUsers = await User.findAll({
      where: { id: userIds, status: 'blocked' },
      attributes: ['id'],
    });

    const blockedUserIds = blockedUsers.map((user) => user.id);

    if (blockedUserIds.length === 0) {
      return res.status(400).json({
        message: 'Please Select Blocked Users To Unblock',
      });
    }

    // Update only blocked users to 'active'
    await User.update({ status: 'active' }, { where: { id: blockedUserIds } });
    console.log('Users unblocked successfully:', blockedUserIds); // Debug log

    // Emit event to all clients
    const io = req.app.get('io');
    if (io) {
      io.emit('usersUpdated', { action: 'unblock', userIds: blockedUserIds });
      console.log('Emitted usersUpdated event:', { action: 'unblock', userIds: blockedUserIds }); // Debug log
    } else {
      console.error('Socket.IO instance (io) is not available'); // Debug log
    }

    res.json({ message: 'Users unblocked successfully', unblockedUserIds: blockedUserIds });
  } catch (error) {
    console.error('Error unblocking users:', error.message); // Debug log
    next(createError(500, error.message));
  }
});

// Delete users
router.post('/delete', authMiddleware, async (req, res, next) => {
  try {
    const { userIds } = req.body;
    console.log('Deleting users with IDs:', userIds); // Debug log

    // Delete users
    await User.destroy({ where: { id: userIds } });
    console.log('Users deleted successfully:', userIds); // Debug log

    // Emit event to all clients
    const io = req.app.get('io');
    if (io) {
      io.emit('usersUpdated', { action: 'delete', userIds });
      console.log('Emitted usersUpdated event:', { action: 'delete', userIds }); // Debug log
    } else {
      console.error('Socket.IO instance (io) is not available'); // Debug log
    }

    res.json({ message: 'Users deleted successfully' });
  } catch (error) {
    console.error('Error deleting users:', error.message); // Debug log
    next(createError(500, error.message));
  }
});

module.exports = router;