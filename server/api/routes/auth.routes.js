const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const auth = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * SIGNUP
 * POST /api/auth/signup
 */
router.post("/signup", async (req, res) => {
  try {
    const { full_name, email, password, role, latitude, longitude } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (full_name, email, password_hash, role, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, full_name, email, role, latitude, longitude, created_at
      `,
      [full_name, email, passwordHash, role, latitude || null, longitude || null]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        latitude: user.latitude,
        longitude: user.longitude
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * UPDATE USER LOCATION
 * PUT /api/auth/update-location
 */
router.put("/update-location", auth, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Latitude and longitude required" });
    }

    const result = await pool.query(
      `
      UPDATE users 
      SET latitude = $1, longitude = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id, latitude, longitude
      `,
      [latitude, longitude, req.user.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

module.exports = router;