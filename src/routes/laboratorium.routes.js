const express = require('express');
const router = express.Router();
const laboratoriumController = require('../controllers/laboratorium.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Publicly authenticated queries
router.get('/', authMiddleware, laboratoriumController.getAllLaboratorium);
router.get('/:id', authMiddleware, laboratoriumController.getLaboratoriumById);

// Write/Edit queries restricted to Laborans
router.post('/', authMiddleware, authorize('Laboran'), laboratoriumController.createLaboratorium);
router.put('/:id', authMiddleware, authorize('Laboran'), laboratoriumController.updateLaboratorium);
router.delete('/:id', authMiddleware, authorize('Laboran'), laboratoriumController.deleteLaboratorium);

module.exports = router;
