const express = require("express");
const router = express.Router();

const { verifyToken, technicianAuthCheck } = require("../middlewares/technicianAuthCheck");

const {
    getAssignedIssues,
    getTechnicianIssueDetails,
    updateIssueStatus,
    uploadProof
} = require("../controllers/technicianIssue.controller");

//get all issues assigned to the technician
router.get(
    "/assigned",
    verifyToken,
    technicianAuthCheck("technician"),
    getAssignedIssues
);

//get single issue details
router.get(
    "/:id",
    verifyToken,
    technicianAuthCheck("technician"),
    getTechnicianIssueDetails
);

//update issue status
router.patch(
    "/:id/status",
    verifyToken,
    technicianAuthCheck("technician"),
    updateIssueStatus
);

//upload work proof
router.patch(
    "/:id/upload-proof",
    verifyToken,
    technicianAuthCheck("technician"),
    uploadProof
);

module.exports = router;
