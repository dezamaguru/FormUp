const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const conversatiiController = require('../controllers/conversatiiController');

router.get('/', verifyJWT, conversatiiController.getAllConversatii);
router.post('/upload', verifyJWT, conversatiiController.uploadConversatie)

module.exports = router;   

