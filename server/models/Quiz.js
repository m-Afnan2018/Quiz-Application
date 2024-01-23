// models/quizModel.js
const mongoose = require("mongoose");
const { questionSchema } = require("./Question");
const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Q&A", "Poll"],
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with the name of 
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }]
  // questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);
