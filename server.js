const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const galleryRoutes = require("./routes/galleryRoutes");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const siteProjectRoutes = require("./routes/siteProjectRoutes");
const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

//IMAGE ACCESS
app.use("/uploads", express.static("uploads"));

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// PROJECT ROUTES
app.use("/api/gallery", galleryRoutes);

// NEWS ROUTES
app.use("/api/news", newsRoutes);

//SITE PROJECT ROUTES
app.use("/api/site-projects", siteProjectRoutes);

// ================= DATABASE =================
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shreeConstruction",
  )
  .then(() => console.log("MongoDB Connected 🔥"))
  .catch((err) => console.log(err));

// ================= MODELS =================

// 🏗 PROJECT MODEL
const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  date: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", projectSchema);

// 📞 CONTACT MODEL
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// 🏢 SITE PROJECT MODEL
const siteProjectSchema = new mongoose.Schema({
  projectName: String,
  workDone: String,
  workPending: String,
  amountPaid: Number,
  amountUnpaid: Number,
  materialUsed: String,
  materialRemaining: String,
  date: { type: Date, default: Date.now },
});
// const SiteProject = mongoose.model("SiteProject", siteProjectSchema);

// ================= ROUTES =================

// TEST
app.get("/", (req, res) => {
  res.send("Shree Construction API Running 🚀");
});

// ================= PROJECT API =================

// ADD
app.post("/api/projects", async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

// GET
app.get("/api/projects", async (req, res) => {
  const data = await Project.find();
  res.json(data);
});
// GET PROJECT BY ID
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error });
  }
});

// DELETE
app.delete("/api/projects/:id", async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: "Project Deleted" });
});

// ================= CONTACT API =================

// USER SUBMIT
app.post("/api/contact", async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.json(contact);
});

// ADMIN VIEW
app.get("/api/contact", async (req, res) => {
  const data = await Contact.find();
  res.json(data);
});

// DELETE
app.delete("/api/contact/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Contact Deleted" });
});
// UPDATE (PUT)
app.put("/api/contact/:id", async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // returns updated document
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact", error });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});
