import express from "express";
import { createUser, getAllUsers } from "../controllers/userController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("admin"), createUser);
router.get("/", protect, allowRoles("admin","security"), getAllUsers);

export default router;
