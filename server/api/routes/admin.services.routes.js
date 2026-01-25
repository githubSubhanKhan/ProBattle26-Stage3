const express = require("express");
const pool = require("../config/db");

const router = express.Router();

/**
 * GET ALL SERVICES
 */
router.get("/", async (req, res) => {
  const result = await pool.query(`
    SELECT s.*, u.full_name AS provider
    FROM services s
    JOIN users u ON s.provider_id = u.id
    ORDER BY s.created_at DESC
  `);
  res.json({ services: result.rows });
});

/**
 * UPDATE SERVICE
 */
router.put("/:id", async (req, res) => {
  const { title, price, category, is_active } = req.body;

  const result = await pool.query(
    `
    UPDATE services
    SET title = COALESCE($1, title),
        price = COALESCE($2, price),
        category = COALESCE($3, category),
        is_active = COALESCE($4, is_active),
        updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [title, price, category, is_active, req.params.id]
  );

  res.json({ service: result.rows[0] });
});

/**
 * DELETE SERVICE
 */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM services WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
