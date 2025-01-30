const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Allows JSON parsing

// ✅ Register API Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ Default Route (Check if API is running)
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
