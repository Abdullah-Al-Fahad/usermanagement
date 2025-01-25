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

    // Check if any of the users are already blocked
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'status'],
    });

    const alreadyBlockedUsers = users.filter((user) => user.status === 'blocked');
    if (alreadyBlockedUsers.length > 0) {
      const blockedUserIds = alreadyBlockedUsers.map((user) => user.id);
      return res.status(400).json({
        message: `Please Select Active Users To Block`,
      });
    }

    // Update user status to 'blocked'
    await User.update({ status: 'blocked' }, { where: { id: userIds } });
    console.log('Users blocked successfully:', userIds); // Debug log

    // Emit event to all clients
    const io = req.app.get('io');
    if (io) {
      io.emit('usersUpdated', { action: 'block', userIds });
      console.log('Emitted usersUpdated event:', { action: 'block', userIds }); // Debug log
    } else {
      console.error('Socket.IO instance (io) is not available'); // Debug log
    }

    res.json({ message: 'Users blocked successfully' });
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

    // Check if any of the users are already unblocked
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'status'],
    });

    const alreadyUnblockedUsers = users.filter((user) => user.status === 'active');
    if (alreadyUnblockedUsers.length > 0) {
      const unblockedUserIds = alreadyUnblockedUsers.map((user) => user.id);
      return res.status(400).json({
        message: `Please Select Blocked Users To Unblock`,
      });
    }

    // Update user status to 'active'
    await User.update({ status: 'active' }, { where: { id: userIds } });
    console.log('Users unblocked successfully:', userIds); // Debug log

    // Emit event to all clients
    const io = req.app.get('io');
    if (io) {
      io.emit('usersUpdated', { action: 'unblock', userIds });
      console.log('Emitted usersUpdated event:', { action: 'unblock', userIds }); // Debug log
    } else {
      console.error('Socket.IO instance (io) is not available'); // Debug log
    }

    res.json({ message: 'Users unblocked successfully' });
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