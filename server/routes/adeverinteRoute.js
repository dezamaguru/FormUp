const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const adeverinteController = require('../controllers/adeverinteController');
const multer = require('multer');
const upload = multer();

router.post('/upload', verifyJWT, adeverinteController.adaugaSolicitare); //inserare solicitare in db 
router.get('/', verifyJWT, adeverinteController.getAllAdeverinte); 
router.get('/:id', verifyJWT, adeverinteController.getOneAdeverinta);
router.post('/:id/upload', verifyJWT, upload.single('file'), adeverinteController.uploadAdeverintaSolicitata);
router.get('/:id/download', verifyJWT, adeverinteController.downloadAdeverintaSolicitata); 
router.post('/:id/status', verifyJWT, adeverinteController.updateStatusAdeverinta); 

module.exports = router;