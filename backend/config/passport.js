import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Teacher from "../models/Teacher.js";

export const initPassport = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const teacher = await Teacher.findOne({ username });
        if (!teacher) return done(null, false, { message: "Incorrect username" });

        const isMatch = await teacher.comparePassword(password);
        if (!isMatch) return done(null, false, { message: "Incorrect password" });

        return done(null, teacher);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((teacher, done) => {
    done(null, teacher.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const teacher = await Teacher.findById(id);
      done(null, teacher);
    } catch (err) {
      done(err);
    }
  });
};
