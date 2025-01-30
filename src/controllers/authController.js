const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Signup request received:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create user (password is already hashed via User model)
    const user = new User({ name, email, password });
    await user.save();

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Error signing up user", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// ✅ Fix `/me` Route
exports.getUser = async (req, res) => {
  try {
    console.log("Fetching user for ID:", req.user.id);
    
    const user = await User.findById(req.user.id).select("-password"); // ✅ Exclude password from response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};
