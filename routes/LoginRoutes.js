const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ⭐ Hardcoded Admin Credentials
    const ADMIN_EMAIL = "admin@shree.com";
    const ADMIN_PASSWORD = "admin123";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // ⭐ Create token
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Admin login failed" });
  }
});

module.exports = router;
