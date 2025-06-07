const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const statsController = require("../controllers/statisticiController");

router.get("/general", verifyJWT, statsController.getStatisticiGenerale);
router.get("/status-distribution", verifyJWT, statsController.getDistribuireStatusuri);
router.get('/processing-time', statsController.getTimpMediuProcesare);
router.get('/distributie-an-program', statsController.getDistribuireAnProgram);
router.get("/evolutie-cereri", verifyJWT, statsController.getEvolutieCereri);


module.exports = router;
