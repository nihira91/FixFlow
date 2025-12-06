const express = require("express");
const router = express.Router();

const {
    loginTechnician,
    getTechnicianProfile
} = require("../controllers/technicianAuth.controller");

const { verifyToken, technicianAuthCheck } = require("../middleware/technicianAuthCheck");


//technician login
router.post("/loginn", loginTechnician);

//technician profile
router.get(
    "/profile",
    verifyToken,
    technicianAuthCheck("technician"),
    getTechnicianProfile
);

module.exports = router;
module.exports = {
    verifyToken,
    technicianAuthCheck
};