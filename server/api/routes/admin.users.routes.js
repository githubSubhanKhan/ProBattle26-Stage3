const express = require("express");
const pool = require("../config/db");

const router = express.Router();

/**
 * GET ALL USERS
 */
router.get("/", async (req, res) => {
  const result = await pool.query(`
    SELECT id, full_name, email, role, is_verified, city, created_at
    FROM users
    ORDER BY created_at DESC
  `);
  res.json({ users: result.rows });
});

/**
 * UPDATE USER
 */
router.put("/:id", async (req, res) => {
  const { role, is_verified } = req.body;

  const result = await pool.query(
    `
    UPDATE users
    SET role = COALESCE($1, role),
        is_verified = COALESCE($2, is_verified),
        updated_at = NOW()
    WHERE id = $3
    RETURNING *
    `,
    [role, is_verified, req.params.id]
  );

  res.json({ user: result.rows[0] });
});

/**
 * DELETE USER
 */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
