const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const cereriController = require('../controllers/cereriController');
const multer = require('multer');
const upload = multer();

router.get('/', verifyJWT, cereriController.getAllCereri); // listare
router.get('/download/:id', verifyJWT, cereriController.downloadCerere); // download
router.post('/upload', verifyJWT, upload.single('file'), cereriController.uploadCerere); // upload

module.exports = router;
