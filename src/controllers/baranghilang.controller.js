const { BarangHilang } = require('../models');

// GET all lost items
exports.getAllBarangHilang = async (req, res) => {
  try {
    const items = await BarangHilang.findAll({
      order: [['tanggal_ditemukan', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get all barang hilang error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// GET single lost item by ID
exports.getBarangHilangById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await BarangHilang.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Barang hilang record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get barang hilang by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// CREATE a lost item record
exports.createBarangHilang = async (req, res) => {
  try {
    const { 
      nama, 
      lokasi_penemuan, 
      ditemukan_oleh, 
      tanggal_ditemukan, 
      lokasi_penyimpanan 
    } = req.body;

    if (!nama || !lokasi_penemuan || !ditemukan_oleh || !tanggal_ditemukan || !lokasi_penyimpanan) {
      return res.status(400).json({
        success: false,
        message: 'All fields (nama, lokasi_penemuan, ditemukan_oleh, tanggal_ditemukan, lokasi_penyimpanan) are required.'
      });
    }

    const item = await BarangHilang.create({ 
      nama, 
      lokasi_penemuan, 
      ditemukan_oleh, 
      tanggal_ditemukan, 
      lokasi_penyimpanan 
    });

    return res.status(201).json({
      success: true,
      message: 'Barang hilang record created successfully.',
      data: item
    });
  } catch (error) {
    console.error('Create barang hilang error:', error);
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

// UPDATE a lost item record
exports.updateBarangHilang = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nama, 
      lokasi_penemuan, 
      ditemukan_oleh, 
      tanggal_ditemukan, 
      lokasi_penyimpanan 
    } = req.body;

    const item = await BarangHilang.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Barang hilang record not found.'
      });
    }

    if (nama) item.nama = nama;
    if (lokasi_penemuan) item.lokasi_penemuan = lokasi_penemuan;
    if (ditemukan_oleh) item.ditemukan_oleh = ditemukan_oleh;
    if (tanggal_ditemukan) item.tanggal_ditemukan = tanggal_ditemukan;
    if (lokasi_penyimpanan) item.lokasi_penyimpanan = lokasi_penyimpanan;

    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Barang hilang record updated successfully.',
      data: item
    });
  } catch (error) {
    console.error('Update barang hilang error:', error);
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

// DELETE a lost item record
exports.deleteBarangHilang = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await BarangHilang.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Barang hilang record not found.'
      });
    }

    await item.destroy();

    return res.status(200).json({
      success: true,
      message: 'Barang hilang record deleted successfully.'
    });
  } catch (error) {
    console.error('Delete barang hilang error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
