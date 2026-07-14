const { Laboratorium } = require('../models');

// GET all laboratories
exports.getAllLaboratorium = async (req, res) => {
  try {
    const laboratoria = await Laboratorium.findAll({
      order: [['kode', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: laboratoria
    });
  } catch (error) {
    console.error('Get all laboratorium error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// GET single laboratory by ID
exports.getLaboratoriumById = async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await Laboratorium.findByPk(id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratorium not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: lab
    });
  } catch (error) {
    console.error('Get laboratorium by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// CREATE a laboratory
exports.createLaboratorium = async (req, res) => {
  try {
    const { kode, nama } = req.body;

    if (!kode || !nama) {
      return res.status(400).json({
        success: false,
        message: 'Kode and nama are required.'
      });
    }

    // Check if code already exists
    const exists = await Laboratorium.findOne({ where: { kode } });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Laboratorium with code '${kode}' already exists.`
      });
    }

    const lab = await Laboratorium.create({ kode, nama });

    return res.status(201).json({
      success: true,
      message: 'Laboratorium created successfully.',
      data: lab
    });
  } catch (error) {
    console.error('Create laboratorium error:', error);
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

// UPDATE a laboratory
exports.updateLaboratorium = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode, nama } = req.body;

    const lab = await Laboratorium.findByPk(id);
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratorium not found.'
      });
    }

    // If code is being changed, verify uniqueness
    if (kode && kode !== lab.kode) {
      const exists = await Laboratorium.findOne({ where: { kode } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Laboratorium with code '${kode}' already exists.`
        });
      }
      lab.kode = kode;
    }

    if (nama) lab.nama = nama;

    await lab.save();

    return res.status(200).json({
      success: true,
      message: 'Laboratorium updated successfully.',
      data: lab
    });
  } catch (error) {
    console.error('Update laboratorium error:', error);
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

// DELETE a laboratory
exports.deleteLaboratorium = async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await Laboratorium.findByPk(id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Laboratorium not found.'
      });
    }

    await lab.destroy();

    return res.status(200).json({
      success: true,
      message: 'Laboratorium deleted successfully.'
    });
  } catch (error) {
    console.error('Delete laboratorium error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
