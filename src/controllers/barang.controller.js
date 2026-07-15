const { Barang, Laboratorium, Lokasi, Kategori } = require('../models');

// GET all barang (items)
exports.getAllBarang = async (req, res) => {
  try {
    const items = await Barang.findAll({
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Lokasi, as: 'lokasi' },
        { model: Kategori, as: 'kategori' }
      ],
      order: [['nama', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get all barang error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// GET single barang by ID
exports.getBarangById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Barang.findByPk(id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Lokasi, as: 'lokasi' },
        { model: Kategori, as: 'kategori' }
      ]
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Barang not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get barang by id error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

// CREATE a barang record
exports.createBarang = async (req, res) => {
  try {
    const { nama, jumlah, id_laboratorium, id_lokasi, id_kategori } = req.body;

    // Validate required fields
    if (!nama) {
      return res.status(400).json({
        success: false,
        message: 'Nama is required.'
      });
    }

    // Validate foreign keys if provided
    if (id_laboratorium) {
      const lab = await Laboratorium.findByPk(id_laboratorium);
      if (!lab) {
        return res.status(400).json({
          success: false,
          message: 'Laboratorium not found.'
        });
      }
    }

    if (id_lokasi) {
      const lokasi = await Lokasi.findByPk(id_lokasi);
      if (!lokasi) {
        return res.status(400).json({
          success: false,
          message: 'Lokasi not found.'
        });
      }
    }

    if (id_kategori) {
      const kategori = await Kategori.findByPk(id_kategori);
      if (!kategori) {
        return res.status(400).json({
          success: false,
          message: 'Kategori not found.'
        });
      }
    }

    const item = await Barang.create({
      nama,
      jumlah: jumlah || 0,
      id_laboratorium,
      id_lokasi,
      id_kategori
    });

    // Fetch the newly created record with its associations loaded
    const createdItem = await Barang.findByPk(item.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Lokasi, as: 'lokasi' },
        { model: Kategori, as: 'kategori' }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Barang created successfully.',
      data: createdItem
    });
  } catch (error) {
    console.error('Create barang error:', error);
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

// UPDATE a barang record
exports.updateBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jumlah, id_laboratorium, id_lokasi, id_kategori } = req.body;

    const item = await Barang.findByPk(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Barang not found.'
      });
    }

    // Validate foreign keys if they are being updated
    if (id_laboratorium !== undefined && id_laboratorium !== item.id_laboratorium) {
      if (id_laboratorium !== null) {
        const lab = await Laboratorium.findByPk(id_laboratorium);
        if (!lab) {
          return res.status(400).json({
            success: false,
            message: 'Laboratorium not found.'
          });
        }
      }
      item.id_laboratorium = id_laboratorium;
    }

    if (id_lokasi !== undefined && id_lokasi !== item.id_lokasi) {
      if (id_lokasi !== null) {
        const lokasi = await Lokasi.findByPk(id_lokasi);
        if (!lokasi) {
          return res.status(400).json({
            success: false,
            message: 'Lokasi not found.'
          });
        }
      }
      item.id_lokasi = id_lokasi;
    }

    if (id_kategori !== undefined && id_kategori !== item.id_kategori) {
      if (id_kategori !== null) {
        const kategori = await Kategori.findByPk(id_kategori);
        if (!kategori) {
          return res.status(400).json({
            success: false,
            message: 'Kategori not found.'
          });
        }
      }
      item.id_kategori = id_kategori;
    }

    if (nama !== undefined) item.nama = nama;
    if (jumlah !== undefined) item.jumlah = jumlah;

    await item.save();

    // Fetch the updated record with its associations loaded
    const updatedItem = await Barang.findByPk(item.id, {
      include: [
        { model: Laboratorium, as: 'laboratorium' },
        { model: Lokasi, as: 'lokasi' },
        { model: Kategori, as: 'kategori' }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Barang updated successfully.',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update barang error:', error);
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

// DELETE a barang record
exports.deleteBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Barang.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Barang not found.'
      });
    }

    await item.destroy();

    return res.status(200).json({
      success: true,
      message: 'Barang deleted successfully.'
    });
  } catch (error) {
    console.error('Delete barang error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};
