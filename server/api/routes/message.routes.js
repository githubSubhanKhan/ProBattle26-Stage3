const express = require("express");
const pool = require("../config/db");
const { io } = require("../index");

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

router.post("/send", async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const result = await pool.query(
            `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
            [senderId, receiverId, content]
        );

        const message = result.rows[0];

        const io = req.app.get("io");

        // 🔥 real-time emit
        io.to(receiverId).emit("receive_message", message);
        io.to(senderId).emit("receive_message", message);

        res.json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Message send failed" });
    }
});

// GET /api/messages/history/:userId/:otherUserId
router.get("/history/:userId/:otherUserId", async (req, res) => {
    const { userId, otherUserId } = req.params;


    const result = await pool.query(
        `
SELECT *
FROM messages
WHERE
(sender_id = $1 AND receiver_id = $2)
OR
(sender_id = $2 AND receiver_id = $1)
ORDER BY created_at ASC
`,
        [userId, otherUserId]
    );


    res.json(result.rows);
});

module.exports = router;