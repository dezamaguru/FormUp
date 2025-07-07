const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyUserType = require('../middleware/verifyUserType');

router.get('/', verifyJWT,  verifyUserType('secretar') , usersController.getAllUsers);
router.get('/getUser', verifyJWT , usersController.getOneUser);
router.post("/fcm-token", verifyJWT, usersController.updateFcmToken);
router.post("/fcm-token/delete", verifyJWT, usersController.deleteFcmToken);

module.exports = router;