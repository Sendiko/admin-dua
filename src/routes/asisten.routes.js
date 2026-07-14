const express = require('express');
const router = express.Router();
const asistenController = require('../controllers/asisten.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// Protect all routes in this file for authenticated users with 'Asisten' role
router.use(authMiddleware, authorize('Asisten'));

router.put('/profile', asistenController.updateProfile);

module.exports = router;
