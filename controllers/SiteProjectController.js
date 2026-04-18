const SiteProject = require("../models/SiteProject");

// ➕ CREATE
exports.createProject = async (req, res) => {
  try {
    const d = req.body;

    const project = await SiteProject.create({
      client: {
        name: d.name,
        address: d.address,
        contact: d.contact,
        email: d.email,
        phone: d.phone,
      },

      site: {
        siteName: d.siteName,
        startDate: d.startDate,
        endDate: d.endDate,
      },

      siteHandler: {
        managerName: d.managerName,
        contact: d.managerPhone,
        email: d.managerEmail,
      },

      progress: {
        foundation: Number(d.foundation) || 0,
        framing: Number(d.framing) || 0,
        electrics: Number(d.electrics) || 0,
        plumbing: Number(d.plumbing) || 0,
      },

      payment: {
        totalAmount: Number(d.totalAmount) || 0,
        paidAmount: Number(d.paidAmount) || 0,
        dueAmount: Number(d.dueAmount) || 0,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 📥 GET ALL
exports.getProjects = async (req, res) => {
  try {
    const projects = await SiteProject.find().sort({ createdAt: -1 });

    const formatted = projects.map((item) => ({
      _id: item._id,

      name: item.client?.name,
      contact: item.client?.contact,
      phone: item.client?.phone,
      email: item.client?.email,
      address: item.client?.address,

      siteName: item.site?.siteName,
      startDate: item.site?.startDate,
      endDate: item.site?.endDate,

      managerName: item.siteHandler?.managerName,
      managerEmail: item.siteHandler?.email,
      managerPhone: item.siteHandler?.contact,

      foundation: item.progress?.foundation,
      framing: item.progress?.framing,
      electrics: item.progress?.electrics,
      plumbing: item.progress?.plumbing,

      totalAmount: item.payment?.totalAmount,
      paidAmount: item.payment?.paidAmount,
      dueAmount: item.payment?.dueAmount,

      date: item.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 GET BY ID ✅
exports.getProjectById = async (req, res) => {
  try {
    const project = await SiteProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ❌ DELETE
exports.deleteProject = async (req, res) => {
  try {
    const deleted = await SiteProject.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ✏️ UPDATE
exports.updateProject = async (req, res) => {
  try {
    const d = req.body;
    console.log("Update request received:", d);
    console.log(
      "Progress values - foundation:",
      d.foundation,
      "framing:",
      d.framing,
    );

    // Use findById first, then save to properly update nested fields
    const project = await SiteProject.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update each field individually
    if (d.name) project.client.name = d.name;
    if (d.address) project.client.address = d.address;
    if (d.contact) project.client.contact = d.contact;
    if (d.email) project.client.email = d.email;
    if (d.phone) project.client.phone = d.phone;
    if (d.siteName) project.site.siteName = d.siteName;
    if (d.startDate) project.site.startDate = d.startDate;
    if (d.endDate) project.site.endDate = d.endDate;
    if (d.managerName) project.siteHandler.managerName = d.managerName;
    if (d.managerPhone) project.siteHandler.contact = d.managerPhone;
    if (d.managerEmail) project.siteHandler.email = d.managerEmail;

    // Progress fields - these are the ones not updating
    project.progress.foundation = Number(d.foundation) || 0;
    project.progress.framing = Number(d.framing) || 0;
    project.progress.electrics = Number(d.electrics) || 0;
    project.progress.plumbing = Number(d.plumbing) || 0;

    // Payment fields
    project.payment.totalAmount = Number(d.totalAmount) || 0;
    project.payment.paidAmount = Number(d.paidAmount) || 0;
    project.payment.dueAmount = Number(d.dueAmount) || 0;

    const updated = await project.save();
    console.log("Updated project progress:", updated.progress);

    // Return formatted data like getProjects
    const formatted = {
      _id: updated._id,
      name: updated.client?.name,
      contact: updated.client?.contact,
      phone: updated.client?.phone,
      email: updated.client?.email,
      address: updated.client?.address,
      siteName: updated.site?.siteName,
      startDate: updated.site?.startDate,
      endDate: updated.site?.endDate,
      managerName: updated.siteHandler?.managerName,
      managerEmail: updated.siteHandler?.email,
      managerPhone: updated.siteHandler?.contact,
      foundation: updated.progress?.foundation,
      framing: updated.progress?.framing,
      electrics: updated.progress?.electrics,
      plumbing: updated.progress?.plumbing,
      totalAmount: updated.payment?.totalAmount,
      paidAmount: updated.payment?.paidAmount,
      dueAmount: updated.payment?.dueAmount,
      date: updated.createdAt,
    };

    res.json(formatted);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};
