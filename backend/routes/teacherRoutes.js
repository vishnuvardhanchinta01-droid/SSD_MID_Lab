import express from "express";
import passport from "passport";
import { createTeacher } from "../controllers/teacherController.js";
// import Teacher from "../models/Teacher.js";

const router = express.Router();

router.post("/signup", createTeacher);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, teacher, info) => {
    if (err) return next(err);
    if (!teacher) return res.status(400).json({ error: info.message });

    req.login(teacher, (err) => {
      if (err) return next(err);
      res.json({ message: "Logged in successfully", teacher: { id: teacher._id, username: teacher.username } });
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

export default router;