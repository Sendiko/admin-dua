const express = require('express');
const router = express.Router();
const laboranController = require('../controllers/laboran.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Protect all routes in this file for authenticated users with 'Laboran' role
router.use(authMiddleware, authorize('Laboran'));

router.post('/register-asisten', laboranController.registerAsisten);
router.get('/asisten', laboranController.getAllAsisten);
router.put('/asisten/:id/laboratorium', laboranController.setAsistenLaboratorium);

module.exports = router;
