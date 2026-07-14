const express = require('express');
const router = express.Router();
const kategoriController = require('../controllers/kategori.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Publicly authenticated queries
router.get('/', authMiddleware, kategoriController.getAllKategori);
router.get('/:id', authMiddleware, kategoriController.getKategoriById);

// Write/Edit queries restricted to Laborans
router.post('/', authMiddleware, authorize('Laboran'), kategoriController.createKategori);
router.put('/:id', authMiddleware, authorize('Laboran'), kategoriController.updateKategori);
router.delete('/:id', authMiddleware, authorize('Laboran'), kategoriController.deleteKategori);

module.exports = router;
