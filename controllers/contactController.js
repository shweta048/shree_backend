const Contact = require("../models/Contact");

const validateRequiredFields = ({
  FullName,
  PhoneNumber,
  EmailAddress,
  SelectServiceType,
  SiteLocation,
  Message,
}) => {
  if (
    !FullName ||
    !PhoneNumber ||
    !EmailAddress ||
    !SelectServiceType ||
    !SiteLocation ||
    !Message
  ) {
    return "FullName, PhoneNumber, EmailAddress, SelectServiceType and SiteLocation are required";
  }

  return null;
};

const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: " invalid contact" });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    console.log("REQ BODY:", req.body); // 🔍 debug

    const { name, phone, email, service, location, message } = req.body;

    if (!name || !phone || !email || !service || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const newContact = await Contact.create({
      name,
      phone,
      email,
      service,
      location,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Contact saved successfully",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};
const updateContact = async (req, res, next) => {
  try {
    const { name, phone, email, service, location, message, status } = req.body;

    // Only update fields that are provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (service !== undefined) updateData.service = service;
    if (location !== undefined) updateData.location = location;
    if (message !== undefined) updateData.message = message;
    if (status !== undefined) updateData.status = status;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedContact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContact,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
