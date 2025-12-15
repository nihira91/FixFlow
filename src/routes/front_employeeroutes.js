const router = require("express").Router();
const auth = require("../middlewares/authmiddleware");
const { allowRoles } = require("../middlewares/rolemiddleware");
const { dashboard } = require("../controllers/front_employeecontroller");

// Employee dashboard (protected)
router.get("/dashboard", auth, allowRoles("employee"), dashboard);

module.exports = router;
