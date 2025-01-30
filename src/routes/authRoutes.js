const express = require("express");
const { signup, login, getUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Debugging: Check if signup and login functions are loaded
console.log("Signup function:", signup);
console.log("Login function:", login);

router.get("/test", (req, res) => {
  res.send("Auth route is working!");
});

// ✅ Authentication Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getUser);

module.exports = router;

