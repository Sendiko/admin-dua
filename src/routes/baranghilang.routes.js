const express = require('express');
const router = express.Router();
const barangHilangController = require('../controllers/baranghilang.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All endpoints require general JWT authentication
router.use(authMiddleware);

router.get('/', barangHilangController.getAllBarangHilang);
router.get('/:id', barangHilangController.getBarangHilangById);
router.post('/', barangHilangController.createBarangHilang);
router.put('/:id', barangHilangController.updateBarangHilang);
router.delete('/:id', barangHilangController.deleteBarangHilang);

module.exports = router;
