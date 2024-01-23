// Question.js
const mongoose = require("mongoose");
const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String, default: "" },
});

const questionSchema = new mongoose.Schema({
  Question: { type: String },
  options: [optionSchema],
  quizType: {
    type: String,
    enum: ["Poll", "Q&A"],
  },
  correctAnswer: {
    type: Number,
    required: function () {
      return this.quizType === "Q&A";
    },
  },
  timer: {
    type: String,
    enum: ["5", "10", "OFF"],
    required: function () {
      return this.quizType === "Q&A";
    },
    default: "OFF",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = { Question, questionSchema };
