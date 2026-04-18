const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

const siteProjectSchema = new mongoose.Schema(
  {
    client: {
      name: { type: String },
      address: String,
      contact: String,
      email: String,
      phone: String,
    },

    site: {
      siteName: String,
      startDate: String,
      endDate: String,
    },

    siteHandler: {
      managerName: String,
      contact: String,
      email: String,
    },

    progress: {
      foundation: { type: Number, default: 0 },
      framing: { type: Number, default: 0 },
      electrics: { type: Number, default: 0 },
      plumbing: { type: Number, default: 0 },
    },

    payment: {
      totalAmount: { type: Number, default: 0 },
      paidAmount: { type: Number, default: 0 },
      dueAmount: { type: Number, default: 0 },
      payments: [paymentSchema],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SiteProject", siteProjectSchema);
