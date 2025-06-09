const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const notificariController = require('../controllers/notificariController');

router.post('/upload', verifyJWT, notificariController.createNotificare);
router.get('/', verifyJWT, notificariController.getNotificari);
router.post('/delete', verifyJWT, notificariController.deleteNotificare);

module.exports = router;