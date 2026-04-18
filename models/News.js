const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", newsSchema);
