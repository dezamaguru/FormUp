const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyUserType = require('../middleware/verifyUserType');

router.get('/', verifyJWT,  verifyUserType('secretar') , usersController.getAllUsers);
router.post("/fcm-token", verifyJWT, usersController.updateFcmToken);


module.exports = router;