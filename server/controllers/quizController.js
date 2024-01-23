// controllers/quizController.js
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");
exports.createQuiz = async (req, res) => {
  try {
    const { name, type } = req.body;
    const userId = req.params.userId; // Assuming the userId is in the params

    // Create a new quiz with just a name and type, no questions yet
    const newQuiz = new Quiz({
      name,
      type,
      creator: userId,
    });

    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error("Error in createQuiz:", error);
    res
      .status(500)
      .json({ message: "Failed to create quiz", error: error.message });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    // This step is redundant for sending a response but shown here for demonstration.
    const quizzesJson = JSON.stringify(quizzes);
    const quizzesParsed = JSON.parse(quizzesJson); // Back to JavaScript object

    res.status(200).json(quizzesParsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addQuestionToQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { questions } = req.body; // assuming `questions` is an array of question objects

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Loop through each question in the array and add to the quiz
    questions.forEach((question) => {
      const newQuestion = {
        Question: question.Question,
        options: question.options,
        correctAnswer:
          question.quizType === "Q&A" ? question.correctAnswer : undefined,
        quizType: question.quizType,
        timer: question.quizType === "Q&A" ? question.timer : "OFF",
      };

      quiz.questions.push(newQuestion);
    });

    await quiz.save();
    return res.status(201).json({ message: "Questions added", quiz });
  } catch (error) {
    console.error("Error in addQuestionToQuiz:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getQuizQuestions = async (req, res) => {
  console.log("Here I am reached");
  try {
    console.log("Request params:", req.params); // Log route parameters
    console.log("Request query:", req.query); // Log query parameters
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!Array.isArray(quiz.questions)) {
      console.error("Quiz questions are not an array:", quiz.questions);
      return res
        .status(500)
        .json({ message: "Questions property not formatted properly." });
    }

    res.status(200).json(quiz.questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    // Trim the id to remove any whitespace or newline characters
    const id = req.params.id.trim();

    // Find the quiz using the trimmed id and increment the impressions count
    const quiz = await Quiz.findByIdAndUpdate(
      id,
      { $inc: { impressions: 1 } }, // Increment impressions field by 1
      { new: true } // Return the updated document
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Return the quiz with the incremented impression count
    res.json(quiz);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid quiz ID format" });
    }
    console.error("Error fetching and updating quiz impressions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
    console.log("quiz deleted");
  }
};

exports.getQuizzesByUserId = async (req, res) => {
  try {
    console.log("user id");
    const userId = req.params.userId;
    console.log(userId);

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: "Invalid user ID" });
    }

    const quizzes = await Quiz.find({ creator: userId });

    console.log(quizzes);

    res.json(quizzes);
  } catch (error) {
    console.error("Error in getQuizzesByUserId:", error);
    res.status(500).send(error.message);
  }
};

exports.createQuizUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the request parameters

    // Assuming the request body contains quiz data, e.g., title and questions
    const { name, type } = req.body;

    // Create a new quiz document associated with the user
    const newQuiz = new Quiz({
      name,
      type,

      creator: userId, // Associate with the logged-in user using the user ID
    });

    // Save the new quiz to the database
    await newQuiz.save();

    res.status(201).json(newQuiz); // Respond with the created quiz
  } catch (error) {
    console.error("Error in createQuiz:", error);
    res.status(500).send(error);
  }
};


exports.trendingQuizzes = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Received user ID:", userId);

    const trendingQuizzes = await Quiz.find({
      creator: userId,
      // other criteria as needed
    })
      .sort({ createdOn: -1 }) // Use 'createdOn' instead of 'createdAt'
      .limit(10)
      .select("name createdOn impressions"); // Use 'createdOn' and include any other fields you want to return

    // Ensure dates are sent in a readable format or as ISO strings
    const quizzesWithFormattedDates = trendingQuizzes.map((quiz) => ({
      ...quiz.toObject(),
      createdOn: quiz.createdOn.toISOString(), // Use 'createdOn' and format the date as needed
    }));

    res.json({ quizzes: quizzesWithFormattedDates });
  } catch (error) {
    console.error("Error fetching trending quizzes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

   

exports.impressionOfQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    // Find the quiz by its ID
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Increment the impressions count
    quiz.impressions += 1;
    await quiz.save(); // Save the updated impressions count

    // Return the updated impressions count to the user
    res.json({ impressions: quiz.impressions });
    
    // Log the updated impressions count
    console.log(quiz.impressions);
  } catch (error) {
    console.error("Error accessing quiz:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAllQuestionsForUserQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all quizzes for the user
    const quizzes = await Quiz.find({ owner: userId }).populate("questions");

    // Flatten all questions from all quizzes into a single array
    const questions = quizzes.reduce(
      (acc, quiz) => acc.concat(quiz.questions),
      []
    );

    res.json({
      message: "Questions fetched successfully",
      questions: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.AllImpression= async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query your database to calculate the total impression count for the specific userId
    const totalImpressions = await Quiz.aggregate([
      {
        $match: { userId }, // Match quizzes with the specific userId
      },
      {
        $group: {
          _id: null,
          totalImpressions: { $sum: '$impressions' },
        },
      },
    ]);

    if (totalImpressions.length > 0) {
      res.json({ totalImpressions: totalImpressions[0].totalImpressions });
    } else {
      res.json({ totalImpressions: 0 }); // Default to 0 if there are no records
    }
  } catch (error) {
    console.error('Error retrieving total impressions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}