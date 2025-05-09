const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const cereriController = require('../controllers/cereriController');
const solicitariCereriController = require('../controllers/solicitariCereriController');
const observatiiController = require('../controllers/observatiiController');
const multer = require('multer');
const upload = multer();

// cereri
router.get('/', verifyJWT, cereriController.getAllCereri); // listare
router.get('/:id/download', verifyJWT, cereriController.downloadCerere); // download
router.post('/upload', verifyJWT, upload.single('file'), cereriController.uploadCerere); // upload
router.get('/:id', verifyJWT, cereriController.getOneCerereTip); // cerere tip
router.post('/:id/modify',upload.single('file'), verifyJWT, cereriController.modifyCerere);
router.post('/:id/delete', verifyJWT, cereriController.deleteCerere);

//solicitari
router.post('/:id/upload',upload.single('file'), verifyJWT, solicitariCereriController.uploadSolicitareCerere);
router.get('/solicitari/:id', verifyJWT, solicitariCereriController.getOneSolicitare); 
router.post('/solicitari/:id/status', verifyJWT, solicitariCereriController.updateStatusSolicitare);

//obseravtii
router.post('/solicitari/:id/upload', verifyJWT, observatiiController.uploadObservatie);
router.get('/solicitari/:id/observatii', verifyJWT, observatiiController.getAllObservatii);
router.post('/solicitari/:id/modify', verifyJWT, observatiiController.modifyObservatie);
router.post('/solicitari/:id/delete', verifyJWT, observatiiController.deleteObservatie);

module.exports = router;    
