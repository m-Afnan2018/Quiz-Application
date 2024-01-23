import React, { useState, useEffect } from "react";
import "./CreateQuestion.css";
// import './create.css'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams,useLocation } from "react-router-dom";
import Vector from "./Vector.png";

const CreateQuestion = () => {
  const { quizId } = useParams();
  // console.log("create quetioin id",quizId)
  const location = useLocation();
  const [quiz, setQuiz] = useState({ name: "", type: "" });
  const [questions, setQuestions] = useState([
    {
      Question: "",
      optionType: 'text',
      options: [
        { text: "", imageUrl: "" },
        { text: "", imageUrl: "" },
      ],
      correctAnswer: null,
      timer: "OFF",
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quizLink, setQuizLink] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [optionType, setOptionType] = useState("text");
  const [timer, setTimer] = useState("OFF");
  const navigate = useNavigate();
  const [impressions, setImpressions] = useState(0); // Track impressions


  useEffect(() => {
    // When the component mounts, set the quiz state from the location state
    if (location.state) {
      setQuiz({
        name: location.state.quizName,
        type: location.state.quizType,
      });
    }
  }, [location.state]);
  // const fetchImpressions = async () => {
  //   try {
  //     // Make a GET request to retrieve impressions count
  //     const response = await fetch(
  //       `http://localhost:5000/api/quizzes/quiz/${quizId}/impression`
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     const impressionsCount = data.impressions || 0;
  //     console.log(impressionsCount)

  //     // Update impressions count
  //     setImpressions(impressionsCount);
  //   } catch (error) {
  //     console.error("Error fetching impressions:", error);
  //     // Handle errors as needed
  //   }
  // };

  // useEffect(() => {
  //   // Fetch quiz data, set it in state, and display the quiz

  //   // Track an impression by making a POST request to the backend
  //   fetchImpressions();
  // }, [location]);


  const QuizModal = ({ isVisible, onClose, link }) => {
    if (!isVisible) return null;

    const shareLink = () => {
      const url = `${window.location.origin}/quiz/${quizId}`;
      console.log(quizId)
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    };
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Congrats your Quiz is Published!</h2>
          <input
            type="text"
            readOnly
            value={link}
            className="modal-link-input"
          />
          <button onClick={shareLink}>Share Link</button>
        </div>
      </div>
    );
  };

  const closePopup = () => {
    navigate("/dashboard");
  };

  const handlePollQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].Question = value;
    setQuestions(newQuestions);
    console.log("updated question after question change", newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value, type) => {
    const newQuestions = [...questions];
    if (type === "text") {
      newQuestions[questionIndex].options[optionIndex].text = value;
    } else if (type === "imageUrl") {
      newQuestions[questionIndex].options[optionIndex].imageUrl = value;
    }
    setQuestions(newQuestions);
    console.log("set new question", setQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", imageUrl: "" });
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    const options = newQuestions[questionIndex].options;

    if (options.length > 2) {
      options.splice(optionIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const addQuestion = () => {
    console.log(questions);
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          Question: "",
          options: [
            { text: "", imageUrl: "" },
            { text: "", imageUrl: "" },
          ],
          correctAnswer: null,
          timer: timer, // Set the timer based on current state
        },
      ]);
      setCurrentQuestionIndex(currentQuestionIndex+1);
    } else {
      toast.error("Cannot add more than 5 questions.");
    }
  };
  const removeQuestion = (index) => {
    const newQuestions = [...questions].filter((_, i) => i !== index);
    setQuestions(newQuestions);

    if (currentQuestionIndex === index) {
      if (index > 0) {
        setCurrentQuestionIndex(index - 1);
      } else if (newQuestions.length > 0) {
        setCurrentQuestionIndex(0);
      } else {
        setCurrentQuestionIndex(null);
      }
    } else if (currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const validateQuiz = () => {
    for (const question of questions) {
      if (!question.Question.trim()) {
        toast.error("Please fill in the poll question");
        return false;
      }

      for (const option of question.options) {
        if (optionType === "text" && !option.text.trim()) {
          toast.error("Please fill in all text options");
          return false;
        } else if (optionType === "image" && !option.imageUrl.trim()) {
          toast.error("Please fill in all image URL options");
          return false;
        } else if (
          optionType === "textAndImage" &&
          (!option.text.trim() || !option.imageUrl.trim())
        ) {
          toast.error("Please fill in all text and image URL options");
          return false;
        }
      }

      // Skip correct answer check for Poll type quizzes
      if (quiz.type !== "Poll") {
        if (
          question.correctAnswer === null ||
          question.correctAnswer >= question.options.length
        ) {
          toast.error("Please select a correct answer for each question");
          return false;
        }
      }
    }
    return true;
  };
  const createQuiz = async () => {
    if (!validateQuiz()) {
      console.error("Validation failed.");
      return;
    }

    const token = localStorage.getItem("token");
    const quizType = quiz.type; // Make sure 'quiz' is defined and has 'type'
    const quizTimer = quizType === "Q&A" ? timer : "OFF"; // 'timer' must also be defined

    const body = questions.map((question) => ({
      Question: question.Question,
      options: question.options,
      quizType: quizType, // This will be the same for all questions if 'quiz.type' is consistent
      correctAnswer: question.correctAnswer,
      timer: quizTimer, // This will be the same for all questions if 'quiz.type' is consistent
    }));

    console.log("Sending request with body:", JSON.stringify(body));

    if (!token) {
      toast.error("You must be logged in to create a quiz.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/quizzes/${quizId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ questions: body }), // Wrap the array of questions inside an object
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.questions || data.questions.length === 0) {
        console.error("Received empty questions in response");
      } else {
        data.questions.forEach((q, index) => {
          console.log(`Question ${index + 1}:`, q.Question);
          console.log(`Options for Question ${index + 1}:`, q.options);
        });
      }

      setIsModalVisible(true);
      setQuizLink(`${window.location.origin}/quiz/${quizId}`);
      console.log(data._id)
      toast.success("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating the quiz:", error);
      toast.error(`Error creating the quiz: ${error.message}`);
    }
  };

  const handleOptionTypeChange = (event) => {
    setOptionType(event.target.value);
    questions[currentQuestionIndex].optionType = event.target.value;
  };

  const handleTimerChange = (time) => {
    setTimer(time);
    const newQuestions = questions.map((q, idx) =>
      idx === currentQuestionIndex ? { ...q, timer: time } : q
    );
    setQuestions(newQuestions);
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setOptionType(questions[index].optionType);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const renderOptionInput = (option, questionIndex, optionIndex) => {
    const currentQuestion = questions[questionIndex];

    const isCorrectAnswer =
      questions[questionIndex].correctAnswer === optionIndex;
    const inputClass = isCorrectAnswer
      ? "correct-option-input"
      : "option-input";

    const inputElement = (
      <input
        type="text"
        value={option.text}
        onChange={(e) =>
          handleOptionChange(questionIndex, optionIndex, e.target.value, "text")
        }
        placeholder={`Text Option ${optionIndex + 1}`}
        className={inputClass}
      />
    );

    const imageElement = (
      <input
        type="text"
        value={option.imageUrl}
        onChange={(e) =>
          handleOptionChange(
            questionIndex,
            optionIndex,
            e.target.value,
            "imageUrl"
          )
        }
        placeholder={`Image URL Option ${optionIndex + 1}`}
        className={inputClass}
      />
    );

    const radioButton = quiz.type !== "Poll" && (
      <input
        type="radio"
        name={`correct-answer-${questionIndex}`}
        checked={isCorrectAnswer}
        onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
        className="correct-answer-radio"
      />
    );
    return (
      <div key={optionIndex} className="option">
        {radioButton}
        {optionType === "text" && inputElement}
        {optionType === "image" && imageElement}
        {optionType === "textAndImage" && (
          <>
            {inputElement}
            {imageElement}
          </>
        )}
        {optionIndex >= 2 && currentQuestion.options.length > 2 && (
          <button
            onClick={() => removeOption(questionIndex, optionIndex)}
            className="remove-option-button"
          >
            <img className="del" src={Vector} alt="" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="quiz-creator">
        <div className="quiz-header">
          {questions.map((_, index) => (
            <div key={index} className="question-with-remove">
              <button
                onClick={() => goToQuestion(index)}
                className={`navigation-button ${
                  currentQuestionIndex === index ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
              {index !== 0 && (
                <button
                  onClick={() => removeQuestion(index)}
                  className="remove-question-button"
                >
                  x
                </button>
              )}
            </div>
          ))}
          {questions.length < 5 && (
            <button onClick={addQuestion} className="add-question-button">
              +
            </button>
          )}
          <span className="max-questions-label">Max 5 questions</span>
        </div>
        {questions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className={`question-block ${
              currentQuestionIndex === questionIndex ? "" : "hidden"
            }`}
          >
            <div className="question-type-header">Quiz Type: {quiz.type}</div>
            <input
              type="text"
              value={question.Question}
              onChange={(e) =>
                handlePollQuestionChange(questionIndex, e.target.value)
              }
              placeholder={
                quiz.type === "Poll" ? "Poll Question" : "Q&A Question"
              }
              className="poll-question-input"
            />

            <div className="option-type-selection">
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="text"
                  checked={optionType === "text"}
                  onChange={handleOptionTypeChange}
                />
                Text
              </label>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="image"
                  checked={optionType === "image"}
                  onChange={handleOptionTypeChange}
                />
                Image URL
              </label>
              <label>
                <input
                  type="radio"
                  name="optionType"
                  value="textAndImage"
                  checked={optionType === "textAndImage"}
                  onChange={handleOptionTypeChange}
                />
                Text & Image URL
              </label>
            </div>

            <div className="text-image-inputs">
              {question.options.map((option, optionIndex) =>
                renderOptionInput(option, questionIndex, optionIndex)
              )}
              {question.options.length < 4 && (
                <button
                  onClick={() => addOption(questionIndex)}
                  className="add-option-button"
                >
                  Add option
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="timer-selection">
          {quiz.type !== "Poll" && (
            <>
              <button
                className={
                  timer === "5" ? "timer-button active" : "timer-button"
                }
                onClick={() => handleTimerChange("5")}
              >
                5 sec
              </button>
              <button
                className={
                  timer === "10" ? "timer-button active" : "timer-button"
                }
                onClick={() => handleTimerChange("10")}
              >
                10 sec
              </button>
              <button
                className={
                  timer === "OFF" ? "timer-button active" : "timer-button"
                }
                onClick={() => handleTimerChange("OFF")}
              >
                OFF
              </button>
            </>
          )}
        </div>

        <div className="quiz-footer">
          <button onClick={closePopup} className="cancel-button">
            Cancel
          </button>
          <button onClick={createQuiz} className="create-quiz-button">
            Create Quiz
          </button>
        </div>
        <QuizModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          link={quizLink} // Replace with actual quiz link
          // impressions={impressions}
        />
        {/* <div>{impressions}</div> */}
      </div>
    </div>
  );
};

export default CreateQuestion;
