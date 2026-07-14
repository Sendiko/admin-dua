const { Bap, Laboratorium, User, Role } = require('../models');

// GET all Bap records
exports.getAllBap = async (req, res) => {
  try {
    const records = await Bap.findAll({
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] },
          include: [{ model: Role, as: 'role' }]
        }
      ],
      order: [['tanggal', 'DESC'], ['jam_masuk', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get all BAP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// GET single Bap record by ID
exports.getBapById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Bap.findByPk(id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] },
          include: [{ model: Role, as: 'role' }]
        }
      ]
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Bap record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Get Bap by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// CREATE a Bap record
exports.createBap = async (req, res) => {
  try {
    const { 
      tanggal, 
      jam_masuk, 
      jam_keluar, 
      jumlah_jam, 
      deskripsi_pekerjaan, 
      paraf, 
      type, 
      id_laboratorium 
    } = req.body;

    // Validate required fields
    if (!tanggal || !jam_masuk || !jam_keluar || !deskripsi_pekerjaan || !type) {
      return res.status(400).json({
        success: false,
        message: 'tanggal, jam_masuk, jam_keluar, deskripsi_pekerjaan, and type are required.'
      });
    }

    // Default target laboratorium to current user's laboratory if not provided
    const targetLaboratoriumId = id_laboratorium || req.user.id_laboratorium;

    const record = await Bap.create({
      tanggal,
      jam_masuk,
      jam_keluar,
      jumlah_jam: jumlah_jam || 0,
      deskripsi_pekerjaan,
      paraf: paraf || 0,
      type,
      id_laboratorium: targetLaboratoriumId,
      id_user: req.user.id
    });

    const createdRecord = await Bap.findByPk(record.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Bap record created successfully.',
      data: createdRecord
    });
  } catch (error) {
    console.error('Create Bap error:', error);
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

// UPDATE a Bap record
exports.updateBap = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      tanggal, 
      jam_masuk, 
      jam_keluar, 
      jumlah_jam, 
      deskripsi_pekerjaan, 
      paraf, 
      type, 
      id_laboratorium 
    } = req.body;

    const record = await Bap.findByPk(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Bap record not found.'
      });
    }

    // Authorization check: Only the creator (id_user matches req.user.id) OR a user with 'Laboran' role can update
    const isOwner = record.id_user === req.user.id;
    const isLaboran = req.user.role && req.user.role.nama.toLowerCase() === 'laboran';

    if (!isOwner && !isLaboran) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to update this record.'
      });
    }

    if (tanggal) record.tanggal = tanggal;
    if (jam_masuk) record.jam_masuk = jam_masuk;
    if (jam_keluar) record.jam_keluar = jam_keluar;
    if (jumlah_jam !== undefined) record.jumlah_jam = jumlah_jam;
    if (deskripsi_pekerjaan) record.deskripsi_pekerjaan = deskripsi_pekerjaan;
    if (paraf !== undefined) record.paraf = paraf;
    if (type) record.type = type;
    if (id_laboratorium !== undefined) record.id_laboratorium = id_laboratorium;

    await record.save();

    const updatedRecord = await Bap.findByPk(record.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { 
          model: User, 
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Bap record updated successfully.',
      data: updatedRecord
    });
  } catch (error) {
    console.error('Update Bap error:', error);
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

// DELETE a Bap record
exports.deleteBap = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Bap.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Bap record not found.'
      });
    }

    // Authorization check: Only the creator OR a user with 'Laboran' role can delete
    const isOwner = record.id_user === req.user.id;
    const isLaboran = req.user.role && req.user.role.nama.toLowerCase() === 'laboran';

    if (!isOwner && !isLaboran) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to delete this record.'
      });
    }

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: 'Bap record deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Bap error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
