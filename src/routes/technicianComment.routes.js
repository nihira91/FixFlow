const express = require("express");
const router = express.Router();
const { verifyToken, technicianAuthCheck } = require("../middlewares/technicianAuthCheck");

const {
    addTechComment,
    getTechIssueComments
} = require("../controllers/technicianComment.controller");

router.post(
    "/:id/comment",
    verifyToken,
    technicianAuthCheck("technician"),
    addTechComment
);

router.get(
    "/:id/comments",
    verifyToken,
    technicianAuthCheck("technician"),
    getTechIssueComments
);

module.exports = router;
