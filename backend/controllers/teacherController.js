import Teacher from "../models/Teacher.js";
import { v4 as uuidv4 } from "uuid";

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await Teacher.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Teacher already exists" });
    }

    // Create teacher with first classroom
    const firstClassroomId = uuidv4();
    const teacher = new Teacher({ 
      username, 
      password,
      classrooms: [firstClassroomId]
    });
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
    const newClassroomId = uuidv4();

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $push: { classrooms: newClassroomId } },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(201).json({
      message: "Classroom created successfully",
      classroom_id: newClassroomId,
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
    
    const teacher = await Teacher.findById(teacherId).select('classrooms username');
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({
      username: teacher.username,
      classrooms: teacher.classrooms,
      total_classrooms: teacher.classrooms.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};