const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const solicitariCereriController = require('../controllers/solicitariCereriController');

// solicitari
router.get('/', verifyJWT, solicitariCereriController.getAllSolicitariCereri); // istoric solicitari
//router.get('/:id', verifyJWT, solicitariCereriController.getOneSolicitare); // detalii solicitare

module.exports = router;