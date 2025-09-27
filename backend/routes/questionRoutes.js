import express from "express";
import { createQuestion, getQuestions, updateStatus, deleteQuestion } from "../controllers/questionController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.post("/", createQuestion);
router.get("/:classroom_id", getQuestions);

// Teacher routes
router.patch("/:id/status", isAuthenticated, updateStatus);
router.delete("/:id", isAuthenticated, deleteQuestion);

export default router;