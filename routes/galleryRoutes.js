const express = require("express");
const {
  createGallery,
  getGallery,
  getGalleryById,
  deleteGallery,
  updateGallery,
} = require("../controllers/galleryController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("image"), createGallery);

router.get("/", getGallery);

router.get("/:id", getGalleryById);

router.delete("/:id", deleteGallery);

router.put("/:id", upload.single("image"), updateGallery);

module.exports = router;
