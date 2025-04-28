const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const cereriController = require('../controllers/cereriController');
const solicitariCereriController = require('../controllers/solicitariCereriController');
const multer = require('multer');
const upload = multer();

//cereri
router.get('/', verifyJWT, cereriController.getAllCereri); // listare
router.get('/:id/download', verifyJWT, cereriController.downloadCerere); // download
router.post('/upload', verifyJWT, upload.single('file'), cereriController.uploadCerere); // upload
router.get('/:id', verifyJWT, cereriController.getOneCerereTip); //cerere tip

//solicitari
router.post('/:id/upload', verifyJWT, upload.single('file'), solicitariCereriController.uploadSolicitareCerere);

module.exports = router;
