const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createNews,
  getNews,
  deletenews,
  updateNews,
} = require("../controllers/newsController");

const authMiddleware = require("../middleware/authMiddleware");

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ ROUTES
router.post("/", authMiddleware, upload.single("image"), createNews);
router.get("/", authMiddleware, getNews);

router.get("/:id", authMiddleware, async (req, res) => {
  const News = require("../models/News");
  const news = await News.findById(req.params.id);
  res.json(news);
});

router.delete("/:id", authMiddleware, deletenews);
router.put("/:id", authMiddleware, upload.single("image"), updateNews);

module.exports = router;
