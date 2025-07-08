const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyUserType = require('../middleware/verifyUserType');

router.get('/', verifyJWT, verifyUserType('admin'), usersController.getAllUsers);
router.get('/getUser', verifyJWT, usersController.getOneUser);
router.post("/fcm-token", verifyJWT, usersController.updateFcmToken);
router.post("/fcm-token/delete", verifyJWT, usersController.deleteFcmToken);
router.get('/search', verifyJWT, usersController.findUserByEmail);
router.post('/register', verifyJWT, verifyUserType('admin'), usersController.registerUser);
router.put('/:id', verifyJWT, usersController.updateUser);
router.delete("/:id", verifyJWT, verifyUserType('admin'), usersController.deleteUser);

module.exports = router;