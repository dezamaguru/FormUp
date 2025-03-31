const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const veirfyJWT = require('../middleware/verifyJWT');
const verifyUserType = require('../middleware/verifyUserType');

router.get('/', veirfyJWT, verifyUserType('student') ,usersController.getAllUsers);

module.exports = router;