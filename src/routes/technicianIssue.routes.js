const express = require("express");
const router = express.Router();

const { verifyToken, checkRole } = require("../middlewares/roleCheck");

const {
    getAssignedIssues,
    getSingleIssue,
    updateIssueStatus,
    uploadWorkProof

} = require("../controllers/technicianIssue.controller");

//get all issues assigned to the technician

router.get(
    "/issues/assigned",
    verifyToken,
    checkRole("technician"),
    getAssignedIssues
);

//get single issue details
router.get(
    "/issue/:id",
    verifyToken,
    checkRole("technician"),
    getSingleIssue
);

//Patch-update issue status
router.patch(
    "/issue/:id/status",
    verifyToken,
    checkRole("technician"),
    updateIssueStatus
);

//Patch- upload work proof
router.patch(
    "/issue/:id/upload-proof",
    verifyToken,
    technicianAuthCheck("technician"),
    uploadWorkProof
);

const technicianAuthCheck = require("../middleware/technicianAuthCheck");
router.get(
    "/assigned",
    technicianAuthCheck,
    getAssignedIssues
);

module.exports = router;
module.exports = {
    verifyToken,
    technicianAuthCheck
};
