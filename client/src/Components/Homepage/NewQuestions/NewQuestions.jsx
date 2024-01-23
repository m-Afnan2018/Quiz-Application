// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// const NewQuestions = () => {
//   const { quizId } = useParams();
//   const [quizQuestions, setQuizQuestions] = useState([]);

//   useEffect(() => {
//     const fetchQuizQuestions = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:5000/api/quizzes/${quizId}/questions`
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch quiz questions");
//         }

//         const data = await response.json();
//         setQuizQuestions(data);
//       } catch (error) {
//         toast.error("Failed to fetch quiz questions");
//       }
//     };

//     fetchQuizQuestions();
//   }, [quizId]);

//   return (
//     <div className="quiz-questions-container">
//       <h1>Quiz Questions</h1>
//       <ul>
//         {quizQuestions.map((question, index) => (
//           <li key={index}>{question.Question}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NewQuestions;





import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
// import "./QuizQuestions.css"; // Ensure this path is correct

const NewQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
 console.log(quizId)
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/quizzes/${quizId}/questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((questionsArray) => {
        setQuestions(questionsArray);
        console.log(questionsArray);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [quizId]);

  const handleOptionSelect = useCallback((questionIndex, optionIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  }, []);

  const calculateScore = useCallback(() => {
    let newScore = 0;
    questions.forEach((question, index) => {
      // Assuming correctAnswer is the index of the correct option
      if (question.correctAnswer === selectedAnswers[index]) {
        newScore += 1;
      }
    });
    setScore(newScore);
  }, [questions, selectedAnswers]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      calculateScore();
      setQuizCompleted(true);
    }
  }, [currentQuestionIndex, questions.length, calculateScore]);

  const renderOptions = useCallback(
    (options, questionIndex) => {
      return options.map((option, idx) => (
        <button
          key={idx}
          className={`option-button ${
            selectedAnswers[questionIndex] === idx ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect(questionIndex, idx)}
        >
          {option.text}
        </button>
      ));
    },
    [selectedAnswers, handleOptionSelect]
  );

  return (
    <div className="wrap">
      {quizCompleted ? (
        <div className="quiz-completed-container">
          <h1>Congrats! Quiz is completed</h1>
          <p>
            Your Score: {score}/{questions.length}
          </p>
        </div>
      ) : (
        <div className="quiz-container">
          {questions.length > 0 ? (
            <div className="question-card">
              <div className="question-header">
                <div className="question-number">
                  Question {currentQuestionIndex + 1}/{questions.length}
                </div>
              </div>
              <div className="question-text">
                {questions[currentQuestionIndex].pollQuestion}
              </div>
              <div className="options-container">
                {renderOptions(
                  questions[currentQuestionIndex].options,
                  currentQuestionIndex
                )}
              </div>
              <button className="next-button" onClick={goToNextQuestion}>
                {currentQuestionIndex === questions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      )}
    </div>
  );
};
export default NewQuestions


