const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barang.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// All endpoints require general JWT authentication
router.use(authMiddleware);

// Get queries (open to all authenticated users: Laboran and Asisten)
router.get('/', barangController.getAllBarang);
router.get('/:id', barangController.getBarangById);

// Write/Edit queries (accessible by both Laboran and Asisten)
router.post('/', authorize('Laboran', 'Asisten'), barangController.createBarang);
router.put('/:id', authorize('Laboran', 'Asisten'), barangController.updateBarang);
router.delete('/:id', authorize('Laboran', 'Asisten'), barangController.deleteBarang);

module.exports = router;
