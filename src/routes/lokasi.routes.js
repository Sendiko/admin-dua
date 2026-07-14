const express = require('express');
const router = express.Router();
const lokasiController = require('../controllers/lokasi.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Publicly authenticated queries
router.get('/', authMiddleware, lokasiController.getAllLokasi);
router.get('/:id', authMiddleware, lokasiController.getLokasiById);

// Write/Edit queries restricted to Laborans
router.post('/', authMiddleware, authorize('Laboran'), lokasiController.createLokasi);
router.put('/:id', authMiddleware, authorize('Laboran'), lokasiController.updateLokasi);
router.delete('/:id', authMiddleware, authorize('Laboran'), lokasiController.deleteLokasi);

module.exports = router;
