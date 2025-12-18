const express = require("express");
const router = express.Router();
const { verifyToken, technicianAuthCheck } = require("../middleware/technicianAuthCheck");


const {
    addTechComment,
    getTechIssueComments
} = require("../controllers/technicianComment.controller");

router.post(
    "/issue/:id/comment",
    verifyToken,
    technicianAuthCheck("technician"),
    addTechComment
);

router.get(
    "/issue/:id/comments",
    verifyToken,
    technicianAuthCheck("technician"),
    getTechIssueComments
);

module.exports = router;
module.exports = {
    verifyToken,
    technicianAuthCheck
};
