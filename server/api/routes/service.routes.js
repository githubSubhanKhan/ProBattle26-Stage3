const express = require("express");
const pool = require("../config/db");
const auth = require("../middleware/auth.middleware");
const h3 = require("h3-js");
const RESOLUTION = 6; // Always use consistent resolution
const { haversineDistance } = require("../utils/distance");

const router = express.Router();

/**
 * ADD SERVICE
 * POST /api/services/add-service
 */
router.post("/add-service", auth, async (req, res) => {
  try {
    if (req.user.role !== "PROVIDER") {
      return res.status(403).json({ error: "Only providers can add services" });
    }

    const { title, description, category, price, price_type } = req.body;

    if (!title || !category || price === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Get provider location from DB
    const userResult = await pool.query(
      `SELECT latitude, longitude FROM users WHERE id = $1`,
      [req.user.userId]
    );

    if (userResult.rowCount === 0 || !userResult.rows[0].latitude || !userResult.rows[0].longitude) {
      return res.status(400).json({ error: "User location not set. Please update your location first." });
    }

    const { latitude, longitude } = userResult.rows[0];

    // 2️⃣ Generate H3 index
    const h3Index = h3.latLngToCell(latitude, longitude, RESOLUTION);

    // 3️⃣ Insert service
    const result = await pool.query(
      `
      INSERT INTO services (
        provider_id,
        title,
        description,
        category,
        price,
        price_type,
        location_h3,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *
      `,
      [
        req.user.userId,
        title,
        description,
        category,
        price,
        price_type || "HOURLY",
        h3Index
      ]
    );

    res.status(201).json({
      success: true,
      service: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add service" });
  }
});

/**
 * GET ALL SERVICES
 * GET /api/services
 */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.category,
        s.price,
        s.price_type,
        u.full_name as provider,
        u.city as location,
        u.rating,
        s.availability_start,
        s.availability_end,
        s.created_at
      FROM services s
      JOIN users u ON s.provider_id = u.id
      WHERE s.is_active = true
      ORDER BY s.created_at DESC
      `
    );

    res.status(200).json({
      success: true,
      services: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

/**
 * SEARCH SERVICES BY LOCATION
 * GET /api/services/search-nearby?lat=40.7128&lng=-74.0060&radiusKm=10
 */
router.get("/search-nearby", async (req, res) => {
  try {
    const { lat, lng, radiusKm = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "latitude and longitude required" });
    }

    const searchLat = parseFloat(lat);
    const searchLng = parseFloat(lng);
    const searchRadius = parseFloat(radiusKm);

    // Convert user's location to H3 cell using consistent resolution
    const centerCell = h3.latLngToCell(searchLat, searchLng, RESOLUTION);

    // Get neighboring cells (create a ring around center)
    // Adjust rings based on radius
    let rings = 1;
    if (searchRadius <= 5) rings = 1;
    else if (searchRadius <= 10) rings = 2;
    else if (searchRadius <= 25) rings = 3;
    else rings = 4;
    
    const cells = h3.gridDisk(centerCell, rings);

    console.log(`Search: center=${centerCell}, rings=${rings}, cells=${cells.length}`);

    // Query services in these cells
    const result = await pool.query(
      `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.category,
        s.price,
        s.price_type,
        s.location_h3,
        u.id as provider_id,
        u.full_name as provider,
        u.latitude,
        u.longitude,
        u.rating,
        u.city as location,
        s.created_at
      FROM services s
      JOIN users u ON s.provider_id = u.id
      WHERE s.location_h3 = ANY($1)
      AND s.is_active = true
      AND u.latitude IS NOT NULL
      AND u.longitude IS NOT NULL
      ORDER BY s.created_at DESC
      `,
      [cells]
    );

    console.log(`DB returned ${result.rows.length} services from H3 cells`);

    // Filter by exact haversine distance
    const filteredServices = result.rows.filter(service => {
      const distance = haversineDistance(
        searchLat,
        searchLng,
        parseFloat(service.latitude),
        parseFloat(service.longitude)
      );
      console.log(`Service ${service.id}: distance=${distance.toFixed(2)}km, radius=${searchRadius}km`);
      return distance <= searchRadius;
    });

    console.log(`Final: ${filteredServices.length} services within radius`);

    res.status(200).json({
      success: true,
      searchCenter: { lat: searchLat, lng: searchLng },
      radiusKm: searchRadius,
      servicesFound: filteredServices.length,
      services: filteredServices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search services" });
  }
});

module.exports = router;