const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const createError = require('http-errors');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      status: 'active',
      registrationTime: new Date(),
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      next(createError(400, 'This email is already registered'));
    } else {
      next(createError(400, error.message));
    }
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError(401, 'Invalid credentials');
    }
    if (user.status === 'blocked') {
      throw createError(403, 'Account is blocked');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    await user.update({ lastLogin: new Date() });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }, // Exclude password from the response
    });
    if (!user) {
      throw createError(404, 'User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;