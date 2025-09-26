import express from "express";
import passport from "passport";
// import Teacher from "../models/Teacher.js";

const router = express.Router();

// Teacher signup
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     let existing = await Teacher.findOne({ username });
//     if (existing) return res.status(400).json({ error: "Username already exists" });

//     const teacher = new Teacher({ username, password });
//     await teacher.save();
//     res.status(201).json({ message: "Teacher registered successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Teacher login
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
