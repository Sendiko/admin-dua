const { Kategori } = require('../models');

// GET all categories
exports.getAllKategori = async (req, res) => {
  try {
    const categories = await Kategori.findAll({
      order: [['nama', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get all kategori error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// GET single category by ID
exports.getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Kategori.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get kategori by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// CREATE a category record
exports.createKategori = async (req, res) => {
  try {
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama is required.'
      });
    }

    const category = await Kategori.create({ nama });

    return res.status(201).json({
      success: true,
      message: 'Kategori created successfully.',
      data: category
    });
  } catch (error) {
    console.error('Create kategori error:', error);
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

// UPDATE a category record
exports.updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;

    const category = await Kategori.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori not found.'
      });
    }

    if (nama) category.nama = nama;

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Kategori updated successfully.',
      data: category
    });
  } catch (error) {
    console.error('Update kategori error:', error);
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

// DELETE a category record
exports.deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Kategori.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori not found.'
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: 'Kategori deleted successfully.'
    });
  } catch (error) {
    console.error('Delete kategori error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
