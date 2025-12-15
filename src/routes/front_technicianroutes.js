const router = require("express").Router();
const auth = require("../middlewares/authmiddleware");
const { allowRoles } = require("../middlewares/rolemiddleware");
const { dashboard } = require("../controllers/front_techniciancontroller");

// Technician dashboard
router.get("/dashboard", auth, allowRoles("technician"), dashboard);

module.exports = router;
