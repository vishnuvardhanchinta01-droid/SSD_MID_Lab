import express from "express";
import { createTeacher } from "../controllers/teacherController.js";

const router = express.Router();

// Route to create a teacher
router.post("/", createTeacher);

export default router;
