const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { protect } = require("../Middleware/userMiddleware"); // Make sure the path is correct

router.post("/create", protect, quizController.createQuiz);

router.get("/", protect, quizController.getAllQuizzes);

router.post("/:quizId/questions",  quizController.addQuestionToQuiz);

router.get("/:quizId/questions",quizController.getQuizQuestions)

router.get("/:id", protect, quizController.getQuiz);

router.put("/:id", quizController.updateQuiz);

router.delete("/:id", quizController.deleteQuiz);

router.get("/user/:userId/quizzes/question",  quizController.
getAllQuestionsForUserQuizzes);

router.get("/user/:userId/quizzes", quizController.getQuizzesByUserId);

router.post("/user/:userId/quizzes", quizController.createQuizUser);

router.get("/user/:userId/trending",quizController.trendingQuizzes)

router.get("/quiz/:quizId/impression",quizController.impressionOfQuiz)

router.get('/users/:userId/total/impression',quizController.AllImpression)

module.exports = router;
