const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const solicitariCereriController = require('../controllers/solicitariCereriController');

// solicitari
router.get('/', verifyJWT, solicitariCereriController.getAllSolicitariCereri); 

module.exports = router;