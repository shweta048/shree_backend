const express = require("express");
const router = express.Router();

const {
  createNews,
  getNews,
  deletenews,
  updateNews,
} = require("../controllers/newsController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ use shared multer

// ROUTES
router.post("/", authMiddleware, upload.single("image"), createNews);

router.get("/", getNews);

router.get("/:id", async (req, res) => {
  const News = require("../models/News");
  const news = await News.findById(req.params.id);
  res.json(news);
});

router.delete("/:id", authMiddleware, deletenews);

router.put("/:id", authMiddleware, upload.single("image"), updateNews);

module.exports = router;
