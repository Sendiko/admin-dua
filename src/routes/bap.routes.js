const express = require('express');
const router = express.Router();
const bapController = require('../controllers/bap.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All endpoints require authenticated access
router.use(authMiddleware);

router.get('/', bapController.getAllBap);
router.get('/:id', bapController.getBapById);
router.post('/', bapController.createBap);
router.put('/:id', bapController.updateBap);
router.delete('/:id', bapController.deleteBap);

module.exports = router;
