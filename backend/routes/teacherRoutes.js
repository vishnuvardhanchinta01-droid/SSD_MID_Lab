import express from "express";
import passport from "passport";
import { createTeacher, createClassroom, getClassrooms, getClassroomByCode, deleteClassroom } from "../controllers/teacherController.js";
import { isAuthenticated } from "../middleware/auth.js";
// import Teacher from "../models/Teacher.js";

const router = express.Router();

router.post("/signup", createTeacher);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, teacher, info) => {
    if (err) return next(err);
    if (!teacher) return res.status(400).json({ error: info.message });

    req.login(teacher, (err) => {
      if (err) return next(err);
      res.json({ 
        message: "Logged in successfully", 
        teacher: { 
          id: teacher._id, 
          username: teacher.username, 
          classrooms: teacher.classrooms 
        } 
      });
    });
  })(req, res, next);
});

// Teacher logout
router.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Logged out successfully" });
  });
});

// Classroom management routes (requires authentication)
router.post("/classroom", isAuthenticated, createClassroom);
router.get("/classrooms", isAuthenticated, getClassrooms);
router.delete("/classroom/:code", isAuthenticated, deleteClassroom);

// Public route for students to join classroom
router.get("/classroom/code/:code", getClassroomByCode);

export default router;