import express from "express";
import {
  deleteAccountUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  verifyEmail,
} from "../controllers/userController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:userId", verifyEmail);

// protected routes
router.post("/logout", authenticate, logoutUser);
router
  .route("/profile")
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile)
  .delete(authenticate, deleteAccountUser);

// admin routes
router.get("/admin/users", authenticate, isAdmin, getAllUsers);
router
  .route("/admin/users/:id")
  .get(authenticate, isAdmin, getUserById)
  .delete(authenticate, isAdmin, deleteUserById);

export default router;
