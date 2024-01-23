const { Question } = require("../models/Question");
const mongoose = require("mongoose");

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createQuestion = async (req, res) => {
  try {
    // Check if the user is authenticated and req.user is set
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;

    // Create a new question with the creator field set to userId
    const question = new Question({
      ...req.body,
      creator: userId,
    });

    // Save the question to the database
    await question.save();

    // Send a 201 Created response with the created question
    res.status(201).json(question);
  } catch (error) {
    // Handle errors
    console.error("Error creating a new question:", error);
    res.status(500).send(error.message);
  }
};


exports.getQuestionsByUser = async (req, res) => {
  try {
    // Assuming 'userId' is a parameter in the route '/api/questions/:userId'
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    // Assuming 'creator' is the field that references the userId in the Question schema
    const questions = await Question.find({ creator: userId });
    res.json(questions);
    console.log(questions);
  } catch (error) {
    console.error("Error in getQuestionsByUser:", error);
    res.status(500).send(error.message);
  }
};
