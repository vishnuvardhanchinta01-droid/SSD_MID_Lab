import express from "express";
import { createQuestion, getQuestions, updateStatus, deleteQuestion } from "../controllers/questionController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.post("/", createQuestion);

// Teacher routes
router.get("/", isAuthenticated, getQuestions);
router.patch("/:id/status", isAuthenticated, updateStatus);
router.delete("/:id", isAuthenticated, deleteQuestion);

export default router;