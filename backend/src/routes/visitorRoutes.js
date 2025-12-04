import express from "express";
import {
    createVisitor,
    updateVisitorIn,
    updateVisitorOut,
    getAllVisitors,
    getMyVisitors,
    updateVisitorMeeting
} from "../controllers/visitorController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("admin", "security"), createVisitor);
router.patch("/:id/in", protect, allowRoles("security"), updateVisitorIn);
router.patch("/:id/out", protect, allowRoles("security"), updateVisitorOut);
router.get("/", protect, allowRoles("admin", "security"), getAllVisitors);
router.get("/my", protect, allowRoles("manager", "hr"), getMyVisitors);
router.patch(
  "/:id/meeting",
  protect,
  allowRoles("manager", "hr"),
  updateVisitorMeeting
);

export default router;
