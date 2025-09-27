import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { connectDB } from "./config/db.js";
import questionRoutes from "./routes/questionRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import { initPassport } from "./config/passport.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.REACT_URL || "http://localhost:3000",
    credentials: true,
  })
);

initPassport();
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/question", questionRoutes);
app.use("/teacher", teacherRoutes);

app.get("/", (req, res) => res.send("Note App API running"));

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
