const News = require("../models/News");

// ✅ CREATE NEWS
const createNews = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const news = await News.create({
      title,
      description,
      image: req.file.filename,
      userId: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET ALL NEWS
const getNews = async (req, res, next) => {
  try {
    const filter = req.user ? { userId: req.user._id } : {};

    const news = await News.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ DELETE NEWS
const deletenews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // ✅ SAFE ownership check
    if (req.user && news.userId) {
      if (news.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ UPDATE NEWS
const updateNews = async (req, res, next) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // ✅ SAFE ownership check
    if (req.user && news.userId) {
      if (news.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized",
        });
      }
    }

    const updated = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNews,
  getNews,
  deletenews,
  updateNews,
};
