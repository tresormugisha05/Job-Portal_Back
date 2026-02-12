import express from "express";
import { protect } from "../middleware/auth.Middleware";
import { authorize } from "../middleware/authorize";
import { profileUpload } from "../middleware/profileUpload.middleware";
import {
  addUser,
  getUserById,
  updateUser,
  deleteUserById,
  loginUser,
  logoutUser,
  changePassword,
  toggleUserStatus,
} from "../controllers/User.Controller";
import { getAllUsers } from "../controllers/adminController";
const router = express.Router();
router.post("/register", profileUpload.single("profile"), addUser);
router.get("/", getAllUsers);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/change-password", protect, changePassword);
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, authorize("ADMIN"), deleteUserById);
router.patch("/:id/status", protect, authorize("ADMIN"), toggleUserStatus);

export default router;
