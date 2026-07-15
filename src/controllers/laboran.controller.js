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
    delete assistantJson.id_laboratorium;

    if (assistantJson.laboratorium) {
      delete assistantJson.laboratorium.createdAt;
      delete assistantJson.laboratorium.updatedAt;
    }

    if (assistantJson.role) {
      delete assistantJson.role.createdAt;
      delete assistantJson.role.updatedAt;
    }

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

// GET all assistants
exports.getAllAsisten = async (req, res) => {
  try {
    const asistenRole = await Role.findOne({ where: { nama: 'Asisten' } });
    if (!asistenRole) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const assistants = await User.findAll({
      where: { id_role: asistenRole.id },
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ],
      order: [['nama_lengkap', 'ASC']]
    });

    const formattedAssistants = assistants.map(assistant => {
      const assistantJson = assistant.toJSON();
      delete assistantJson.password;
      delete assistantJson.id_laboratorium;

      if (assistantJson.laboratorium) {
        delete assistantJson.laboratorium.createdAt;
        delete assistantJson.laboratorium.updatedAt;
      }

      if (assistantJson.role) {
        delete assistantJson.role.createdAt;
        delete assistantJson.role.updatedAt;
      }

      return assistantJson;
    });

    return res.status(200).json({
      success: true,
      data: formattedAssistants
    });
  } catch (error) {
    console.error('Get all assistants error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// PUT set assistant's laboratory
exports.setAsistenLaboratorium = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_laboratorium } = req.body;

    if (id_laboratorium === undefined) {
      return res.status(400).json({
        success: false,
        message: 'id_laboratorium is required.'
      });
    }

    // Verify laboratory exists if not null
    if (id_laboratorium !== null) {
      const lab = await Laboratorium.findByPk(id_laboratorium);
      if (!lab) {
        return res.status(404).json({
          success: false,
          message: 'Laboratorium not found.'
        });
      }
    }

    // Find user and check if they are an assistant
    const assistant = await User.findByPk(id, {
      include: [{ model: Role, as: 'role' }]
    });

    if (!assistant || !assistant.role || assistant.role.nama.toLowerCase() !== 'asisten') {
      return res.status(404).json({
        success: false,
        message: 'Assistant not found.'
      });
    }

    // Update laboratory ID
    assistant.id_laboratorium = id_laboratorium;
    await assistant.save();

    // Fetch updated user with associations
    const updatedAssistant = await User.findByPk(id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Role, as: 'role' }
      ]
    });

    const assistantJson = updatedAssistant.toJSON();
    delete assistantJson.password;
    delete assistantJson.id_laboratorium;

    if (assistantJson.laboratorium) {
      delete assistantJson.laboratorium.createdAt;
      delete assistantJson.laboratorium.updatedAt;
    }

    if (assistantJson.role) {
      delete assistantJson.role.createdAt;
      delete assistantJson.role.updatedAt;
    }

    return res.status(200).json({
      success: true,
      message: "Assistant's laboratory updated successfully.",
      data: {
        user: assistantJson
      }
    });
  } catch (error) {
    console.error("Set assistant's laboratory error:", error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};


