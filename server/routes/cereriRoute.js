const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const cereriController = require('../controllers/cereriController');
const solicitariCereriController = require('../controllers/solicitariCereriController');
const observatiiController = require('../controllers/observatiiController');
const multer = require('multer');
const upload = multer();

// // solicitari
// router.get('/solicitari', verifyJWT, solicitariCereriController.getAllSolicitariCereri); // istoric solicitari
// router.get('/solicitari/:id', verifyJWT, solicitariCereriController.getOneSolicitare); // detalii solicitare

// cereri
router.get('/', verifyJWT, cereriController.getAllCereri); // listare
router.get('/:id/download', verifyJWT, cereriController.downloadCerere); // download
router.post('/upload', verifyJWT, upload.single('file'), cereriController.uploadCerere); // upload
router.get('/:id', verifyJWT, cereriController.getOneCerereTip); // cerere tip

router.post('/:id/upload',upload.single('file'), verifyJWT, solicitariCereriController.uploadSolicitareCerere);
router.get('/solicitari/:id', verifyJWT, solicitariCereriController.getOneSolicitare);
router.post('/solicitari/:id/upload', verifyJWT, observatiiController.uploadObservatie);
router.get('/solicitari/:id/observatii', verifyJWT, observatiiController.getAllObservatii);
module.exports = router;    
