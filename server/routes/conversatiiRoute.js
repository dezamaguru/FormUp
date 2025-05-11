const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const conversatiiController = require('../controllers/conversatiiController');

router.get('/', verifyJWT, conversatiiController.getAllConversatii);
router.get('/mesaje/:id', verifyJWT, conversatiiController.getAllMessages);
router.post('/upload', verifyJWT, conversatiiController.uploadConversatie);
router.post('/send', verifyJWT, conversatiiController.sendMessage);

module.exports = router;   

