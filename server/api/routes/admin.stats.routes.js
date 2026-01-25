const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await pool.query("SELECT COUNT(*) FROM users");
  const services = await pool.query("SELECT COUNT(*) FROM services");
  const providers = await pool.query("SELECT COUNT(*) FROM users WHERE role='PROVIDER'");
  const seekers = await pool.query("SELECT COUNT(*) FROM users WHERE role='SEEKER'");

  res.json({
    users: users.rows[0].count,
    services: services.rows[0].count,
    providers: providers.rows[0].count,
    seekers: seekers.rows[0].count
  });
});

module.exports = router;
