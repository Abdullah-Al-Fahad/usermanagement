const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw createError(401, 'Access denied');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.status === 'blocked') {
      throw createError(401, 'Account blocked or deleted');
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, error.message));
  }
};

module.exports = authMiddleware;