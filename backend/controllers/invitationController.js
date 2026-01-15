const Invitation = require("../models/Invitation");
const Project = require("../models/Project");
const User = require("../models/User");

// Send invitation
exports.sendInvitation = async (req, res) => {
  try {
    const { email, projectId } = req.body;

    if (!email || !projectId) {
      return res
        .status(400)
        .json({ message: "Email and projectId are required" });
    }

    // Check if project exists and user is a member
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    // Check if user with this email exists
    const targetUser = await User.findOne({ email: email.toLowerCase() });
    if (targetUser && project.members.includes(targetUser._id)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this project" });
    }

    // Check if pending invitation already exists
    const existingInvitation = await Invitation.findOne({
      email: email.toLowerCase(),
      projectId,
      status: "pending",
    });

    if (existingInvitation) {
      return res
        .status(400)
        .json({ message: "Invitation already sent to this email" });
    }

    // Create invitation
    const invitation = await Invitation.create({
      email: email.toLowerCase(),
      projectId,
      invitedBy: req.user._id,
    });

    await invitation.populate("projectId", "name");
    await invitation.populate("invitedBy", "name email");

    res.status(201).json(invitation);
  } catch (error) {
    console.error("Error sending invitation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's invitations
exports.getMyInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      email: req.user.email,
      status: "pending",
    })
      .populate("projectId", "name")
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept invitation
exports.acceptInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (invitation.email !== req.user.email) {
      return res
        .status(403)
        .json({ message: "This invitation is not for you" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation already processed" });
    }

    // Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    // Add user to project members
    const project = await Project.findById(invitation.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.members.includes(req.user._id)) {
      project.members.push(req.user._id);
      await project.save();
    }

    // Add project to user's projects array
    const user = await User.findById(req.user._id);
    if (user && !user.projects.includes(project._id)) {
      user.projects.push(project._id);
      await user.save();
    }

    await invitation.populate("projectId", "name");
    await invitation.populate("invitedBy", "name email");

    res.json({
      invitation,
      project: {
        _id: project._id,
        name: project.name,
        description: project.description,
        members: project.members,
      },
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject invitation
exports.rejectInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (invitation.email !== req.user.email) {
      return res
        .status(403)
        .json({ message: "This invitation is not for you" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation already processed" });
    }

    // Update invitation status
    invitation.status = "rejected";
    await invitation.save();

    await invitation.populate("projectId", "name");
    await invitation.populate("invitedBy", "name email");

    res.json(invitation);
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    res.status(500).json({ message: "Server error" });
  }
};
