const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const firebaseController = require('../controllers/FirebaseController');

router.post('/send-notification', verifyJWT, firebaseController.SendFirebaseNotification); 

module.exports = router;