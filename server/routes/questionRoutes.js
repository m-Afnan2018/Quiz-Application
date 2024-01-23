const express = require("express");
const {
  getQuestions,
  createQuestion,
  getQuestionsByUser,
 
} = require("../controllers/questionController");
const router = express.Router();
const { protect } = require("../Middleware/userMiddleware");
router.use(protect);

// Get all questions
router.get("/", getQuestions);

// Create a new question
router.post("/:userId/createquestion", createQuestion);

router.get("/:userId/question",getQuestionsByUser)



module.exports = router;
