import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  onboard,
  googleAuth,
  verifyEmail,
  verifyMFA,
  updateProfile,
  checkAuth,
} from "../controller/authcontroller.js";
import { protectedRoute } from "../middleware/middleware.js";

const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);
route.post("/logout", logoutUser);
route.post("/google", googleAuth);
route.post("/verify-email", verifyEmail);
route.post("/verify-mfa", verifyMFA);

route.put("/onboard", protectedRoute, onboard);
route.put("/update-profile", protectedRoute, updateProfile);
route.get("/check", protectedRoute, checkAuth);

route.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default route;
