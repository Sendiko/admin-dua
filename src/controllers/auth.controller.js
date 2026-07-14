const { User, Laboratorium, Role } = require('../models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'supersecretkey',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
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

    // Generate JWT
    const token = generateToken(userWithAssociations);

    const userJson = userWithAssociations.toJSON();
    delete userJson.password;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: userJson,
        token
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
        message: 'Email/Username and password are required.'
      });
    }

    // Retrieve user using the scope that includes password
    const user = await User.scope('withPassword').findOne({
      where: {
        [Op.or]: [
          { email: login },
          { username: login }
        ]
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

    // Generate JWT
    const token = generateToken(user);

    // Remove password before responding
    const userJson = user.toJSON();
    delete userJson.password;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: userJson,
        token
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
