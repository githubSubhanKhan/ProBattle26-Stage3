const express = require("express");
const pool = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const serviceRoutes = require("./routes/service.routes");

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));
app.use(express.json());

// Test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});