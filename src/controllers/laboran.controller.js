const { User, Role, Laboratorium } = require('../models');
const { Op } = require('sequelize');

exports.registerAsisten = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      nama_lengkap, 
      profileUrl, 
      nomor_telepon, 
      id_laboratorium 
    } = req.body;

    // Validate required fields
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

    // Find or create 'Asisten' role to get its ID
    const [asistenRole] = await Role.findOrCreate({
      where: { nama: 'Asisten' }
    });

    // Default to Laboran's laboratorium if not explicitly provided
    const targetLaboratoriumId = id_laboratorium || req.user.id_laboratorium;

    // Create assistant user
    const assistant = await User.create({
      username,
      email,
      password,
      nama_lengkap,
      profileUrl,
      nomor_telepon,
      id_laboratorium: targetLaboratoriumId,
      id_role: asistenRole.id
    });

    // Fetch user with associations for standard response
    const assistantWithAssociations = await User.findByPk(assistant.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ]
    });

    const assistantJson = assistantWithAssociations.toJSON();
    delete assistantJson.password;

    return res.status(201).json({
      success: true,
      message: 'Assistant registered successfully.',
      data: {
        user: assistantJson
      }
    });
  } catch (error) {
    console.error('Register assistant error:', error);
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
