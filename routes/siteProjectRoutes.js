const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjectById, // ✅ fixed name
  getProjects,
  deleteProject,
  updateProject,
} = require("../controllers/SiteProjectController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminmiddleware");

// ================= ADMIN ROUTES =================
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// ================= PUBLIC ROUTES =================
router.get("/", getProjects); // Get all projects
router.get("/:id", getProjectById); // ✅ Get project by ID

module.exports = router;
