const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";

    if (!user) {
      if (email === adminEmail && password === adminPassword) {
        const token = jwt.sign(
          { id: "admin", role: "admin" },
          process.env.JWT_SECRET,
          { expiresIn: "1d" },
        );

        return res.status(200).json({
          message: "Login successful",
          token,
          user: {
            id: "admin",
            name: "Admin",
            email: adminEmail,
            role: "admin",
          },
        });
      }

      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res
        .status(500)
        .json({ message: "User password missing in database" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role && user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.message === "JWT_SECRET is not configured") {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    return res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  register,
  login,
};
