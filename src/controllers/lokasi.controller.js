const { Lokasi } = require('../models');

// GET all locations
exports.getAllLokasi = async (req, res) => {
  try {
    const locations = await Lokasi.findAll({
      order: [['nama', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Get all lokasi error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// GET single location by ID
exports.getLokasiById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Lokasi.findByPk(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Lokasi not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Get lokasi by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// CREATE a location record
exports.createLokasi = async (req, res) => {
  try {
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama is required.'
      });
    }

    const location = await Lokasi.create({ nama });

    return res.status(201).json({
      success: true,
      message: 'Lokasi created successfully.',
      data: location
    });
  } catch (error) {
    console.error('Create lokasi error:', error);
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

// UPDATE a location record
exports.updateLokasi = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;

    const location = await Lokasi.findByPk(id);
    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Lokasi not found.'
      });
    }

    if (nama) location.nama = nama;

    await location.save();

    return res.status(200).json({
      success: true,
      message: 'Lokasi updated successfully.',
      data: location
    });
  } catch (error) {
    console.error('Update lokasi error:', error);
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

// DELETE a location record
exports.deleteLokasi = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Lokasi.findByPk(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Lokasi not found.'
      });
    }

    await location.destroy();

    return res.status(200).json({
      success: true,
      message: 'Lokasi deleted successfully.'
    });
  } catch (error) {
    console.error('Delete lokasi error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
