const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitationController");
const { auth } = require("../middleware/auth");

// All invitation routes require authentication
router.use(auth);

// Send invitation
router.post("/", invitationController.sendInvitation);

// Get my invitations
router.get("/my", invitationController.getMyInvitations);

// Accept invitation
router.post("/:id/accept", invitationController.acceptInvitation);

// Reject invitation
router.post("/:id/reject", invitationController.rejectInvitation);

module.exports = router;
