const express = require("express");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

const userRoutes = require("./admin.users.routes");
const serviceRoutes = require("./admin.services.routes");
const statsRoutes = require("./admin.stats.routes");

const router = express.Router();

router.use(auth);
router.use(admin);

router.use("/users", userRoutes);
router.use("/services", serviceRoutes);
router.use("/stats", statsRoutes);

module.exports = router;
