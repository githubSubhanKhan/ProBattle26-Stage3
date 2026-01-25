const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// routes/messages.js
router.get("/search", async (req, res) => {
  const { userId, q = "" } = req.query;

  try {
    const result = await pool.query(
      `
      SELECT
        u.id AS "userId",
        u.full_name AS "userName",
        u.role AS "userType",
        MAX(m.content) AS "lastMessage",
        MAX(m.created_at) AS "timestamp",
        COUNT(
          CASE 
            WHEN m.is_read = false AND m.receiver_id = $1 
            THEN 1 
          END
        ) AS "unreadCount"
      FROM users u
      LEFT JOIN messages m
        ON (
          (m.sender_id = u.id AND m.receiver_id = $1)
          OR
          (m.sender_id = $1 AND m.receiver_id = u.id)
        )
      WHERE u.id != $1
        AND u.full_name ILIKE '%' || $2 || '%'
      GROUP BY u.id, u.full_name, u.role
      ORDER BY "timestamp" DESC NULLS LAST
      `,
      [userId, q]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

module.exports = router;