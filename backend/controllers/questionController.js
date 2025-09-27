import Question from "../models/Question.js";

// Student posts a question
export const createQuestion = async (req, res) => {
  try {
    const { classroom_id, question, author } = req.body;
    const newQuestion = new Question({ classroom_id, question, author });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const filters = {};
    if(req.query.classroom_id) filters.classroom_id = req.query.classroom_id;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.author) filters.author = req.query.author;
    if (req.query.from || req.query.to) {
      filters.timestamp = {};
      if (req.query.from) filters.timestamp.$gte = new Date(req.query.from);
      if (req.query.to) filters.timestamp.$lte = new Date(req.query.to);
    }

    const questions = await Question.find(filters).sort({ timestamp: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["answered", "unanswered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!question) return res.status(404).json({ error: "Question not found" });

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};