import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/db.js";
import questionRoutes from "./routes/questionRoutes.js";
import authRoutes from "./routes/auth.js";
import { initPassport } from "./config/passport.js";
import teacherRoutes from "./routes/teacher.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Session and Passport setup
app.use(session({
  secret: process.env.SESSION_SECRET || "secret123",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
initPassport();

// Routes
app.use("/teachers", teacherRoutes);
app.use("/questions", questionRoutes);
app.use("/auth", authRoutes);

// Default route
app.get("/", (req, res) => res.send("Note App API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
