const { User, Laboratorium, Role } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      nama_lengkap,
      profileUrl,
      id_laboratorium,
      id_role,
      nomor_telepon
    } = req.body;

    if (!username || !email || !password || !nama_lengkap) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, password, and nama_lengkap are required.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? 'Email already in use.'
          : 'Username already in use.'
      });
    }

    // Create user. Hooks hash the password automatically.
    const user = await User.create({
      username,
      email,
      password,
      nama_lengkap,
      profileUrl,
      id_laboratorium,
      id_role,
      nomor_telepon
    });

    // Fetch user with associations for standard response
    const userWithAssociations = await User.findByPk(user.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ]
    });

    // Generate JWT and Refresh token
    const token = generateAccessToken(userWithAssociations);
    const refreshToken = generateRefreshToken(userWithAssociations);

    // Save refresh token to database
    await user.update({ refreshToken });

    const userJson = userWithAssociations.toJSON();
    delete userJson.password;
    delete userJson.refreshToken;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: userJson,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map(err => err.message).join(', ')
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    // Retrieve user using the scope that includes password
    const user = await User.scope('withPassword').findOne({
      where: {
        username: login
      },
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Generate Access & Refresh tokens
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to database
    await user.update({ refreshToken });

    // Remove sensitive/internal columns before responding
    const userJson = user.toJSON();
    delete userJson.password;
    delete userJson.refreshToken;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: userJson,
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.'
      });
    }

    // Verify refresh token signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'supersecretrefreshkey');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.'
      });
    }

    // Retrieve user including password and refreshToken fields
    const user = await User.scope('withPassword').findByPk(decoded.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ]
    });

    // Check if user exists and token matches
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.'
      });
    }

    // Generate new access token and rotate the refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save new refresh token to DB
    await user.update({ refreshToken: newRefreshToken });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.'
      });
    }

    // Find the user with this refresh token
    const user = await User.scope('withPassword').findOne({ where: { refreshToken } });
    if (user) {
      // Clear refresh token in database to prevent reuse
      await user.update({ refreshToken: null });
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

exports.me = async (req, res) => {
  try {
    // req.user is set by authMiddleware and already includes associations
    return res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Me controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
