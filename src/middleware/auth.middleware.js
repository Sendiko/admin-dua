const jwt = require('jsonwebtoken');
const { User, Laboratorium, Role } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    
    // Find the user to ensure they still exist in the database
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ]
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User no longer exists.'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    let message = 'Invalid or expired token.';
    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired.';
    }
    return res.status(401).json({
      success: false,
      message
    });
  }
};
