const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { getInstructorDashboardStats  } = require("../controllers/instructorController");


router.get("/dashboard-stats", requireAuth, getInstructorDashboardStats);


module.exports = router;
