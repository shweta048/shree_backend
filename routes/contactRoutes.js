const express = require("express");
const {
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// Create new contact
router.post("/", createContact);
// Get all contacts
router.get("/", getContact);
// Update contact by ID
router.put("/:id", updateContact);
// Delete contact by ID
router.delete("/:id", deleteContact);

module.exports = router;
