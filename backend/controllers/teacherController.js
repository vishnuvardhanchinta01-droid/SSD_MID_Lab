import Teacher from "../models/Teacher.js";
import Classroom from "../models/Classroom.js";
import { v4 as uuidv4 } from "uuid";

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await Teacher.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Teacher already exists" });
    }

    // Create teacher
    const teacher = new Teacher({ username, password });
    await teacher.save();

    // Create first classroom
    const firstClassroom = new Classroom({
      code: uuidv4().substring(0, 6).toUpperCase(), // 6 char code
      name: "My Classroom",
      teacher: teacher._id
    });
    await firstClassroom.save();

    // Update teacher with classroom
    teacher.classrooms = [firstClassroom._id];
    await teacher.save();

    res.status(201).json({
      message: "Teacher created successfully",
      teacher: {
        id: teacher._id,
        username: teacher.username,
        classrooms: teacher.classrooms
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new classroom for an existing teacher
export const createClassroom = async (req, res) => {
  try {
    const teacherId = req.user.id; // From authentication middleware
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Classroom name is required" });
    }

    const classroom = new Classroom({
      code: uuidv4().substring(0, 6).toUpperCase(),
      name,
      teacher: teacherId
    });
    await classroom.save();

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $push: { classrooms: classroom._id } },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(201).json({
      message: "Classroom created successfully",
      _id: classroom._id,
      code: classroom.code,
      name: classroom.name,
      total_classrooms: teacher.classrooms.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all classrooms for a teacher
export const getClassrooms = async (req, res) => {
  try {
    const teacherId = req.user.id; // From authentication middleware

    const classrooms = await Classroom.find({ teacher: teacherId }).select('code name _id students');
    const teacher = await Teacher.findById(teacherId).select('username');

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({
      username: teacher.username,
      classrooms: classrooms.map(c => ({ 
        id: c._id, 
        code: c.code, 
        name: c.name,
        studentCount: c.students ? c.students.length : 0
      })),
      total_classrooms: classrooms.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get classroom by code (for students to join)
export const getClassroomByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const { studentName } = req.body || {};

    const classroom = await Classroom.findOne({ code: code.toUpperCase() });
    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    // Add student to classroom if name is provided and student doesn't already exist
    if (studentName) {
      const studentExists = classroom.students.some(student => student.name === studentName);
      if (!studentExists) {
        classroom.students.push({ name: studentName });
        await classroom.save();
      }
    }

    res.json({
      _id: classroom._id,
      name: classroom.name,
      code: classroom.code,
      studentCount: classroom.students.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete classroom
export const deleteClassroom = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { code } = req.params;

    const classroom = await Classroom.findOneAndDelete({ code: code.toUpperCase(), teacher: teacherId });
    if (!classroom) {
      return res.status(404).json({ error: "Classroom not found" });
    }

    // Remove from teacher's classrooms
    await Teacher.findByIdAndUpdate(teacherId, { $pull: { classrooms: classroom._id } });

    res.json({ message: "Classroom deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};