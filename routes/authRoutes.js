const express = require("express");
const requireAuth = require('../middleware/requireAuth');
const authControllers = require("../controllers/authControllers");

const router = express.Router();


router.post("/signup", authControllers.signup);


router.post("/login", authControllers.login);


router.post("/forgot-password", authControllers.forgotPassword);
router.post("/reset-password/:token", authControllers.resetPassword);


router.get("/profile", requireAuth, authControllers.getProfile);


router.put("/update-profile", requireAuth, authControllers.updateProfile);

module.exports = router;
