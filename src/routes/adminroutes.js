const router = require("express").Router();
const auth = require("../middlewares/authmiddleware");
const { allowRoles } = require("../middlewares/rolemiddleware");
const { dashboard } = require("../controllers/admincontroller");

// Admin dashboard (super access)
router.get("/dashboard", auth, allowRoles("admin"), dashboard);

module.exports = router;
