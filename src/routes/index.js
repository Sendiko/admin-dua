const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const laboranRoutes = require('./laboran.routes');
const asistenRoutes = require('./asisten.routes');
const laboratoriumRoutes = require('./laboratorium.routes');
const barangHilangRoutes = require('./baranghilang.routes');
const lokasiRoutes = require('./lokasi.routes');
const kategoriRoutes = require('./kategori.routes');
const bapRoutes = require('./bap.routes');

// Healthcheck route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running smoothly.',
    timestamp: new Date().toISOString()
  });
});

// Mount auth routes
router.use('/auth', authRoutes);

// Mount laboran routes
router.use('/laboran', laboranRoutes);

// Mount asisten routes
router.use('/asisten', asistenRoutes);

// Mount laboratorium routes
router.use('/laboratorium', laboratoriumRoutes);

// Mount barang-hilang routes
router.use('/barang-hilang', barangHilangRoutes);

// Mount lokasi routes
router.use('/lokasi', lokasiRoutes);

// Mount kategori routes
router.use('/kategori', kategoriRoutes);

// Mount Bap routes
router.use('/bap', bapRoutes);

module.exports = router;
