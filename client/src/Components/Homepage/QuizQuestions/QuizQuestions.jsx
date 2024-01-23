

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import "./QuizQuestions.css"; // Ensure this path is correct
// import image from "./image.png";
// const QuizQuestions = () => {
//   const { quizId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [quizCompleted, setQuizCompleted] = useState(false);
//   const [quizType, setQuizType] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");


//     fetch(`http://localhost:5000/api/quizzes/${quizId}/questions`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((questionsArray) => {
//         setQuestions(questionsArray);
//         if (questionsArray.length > 0) {
//           setQuizType(questionsArray[0].quizType);
//         }
//         console.log(questionsArray);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }, [quizId]);

//   const handleOptionSelect = useCallback((questionIndex, optionIndex) => {
//     setSelectedAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [questionIndex]: optionIndex,
//     }));
//   }, []);

//   const goToNextQuestion = useCallback(() => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       setQuizCompleted(true);
//     }
//   }, [currentQuestionIndex, questions.length]);

//   const renderOptions = useCallback(
//     (options, questionIndex) => {
//       return options.map((option, idx) => (
//         <button
//           key={idx}
//           className={`option-button ${
//             selectedAnswers[questionIndex] === idx ? "selected" : ""
//           }`}
//           onClick={() => handleOptionSelect(questionIndex, idx)}
//         >
//           {option.text}
//         </button>
//       ));
//     },
//     [selectedAnswers, handleOptionSelect]
//   );

//   // useEffect(() => {
//   //   fetch(`http://localhost:5000/api/quizzes/quiz/${quizId}/impression`,
//   //   )
//   //     .then((response) => {
//   //       if (!response.ok) {
//   //         throw new Error(`HTTP error! status: ${response.status}`);
//   //       }
//   //       return response.json();
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error:", error);
//   //     });
    
//   // },[quizCompleted])

//   useEffect(() => {
//     // Increase impression count only when the quiz is completed
//     if (quizCompleted) {
//       fetch(`http://localhost:5000/api/quizzes/quiz/${quizId}/impression`, {
//         method: 'GET',
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//         });
//     }
//   }, [quizId, quizCompleted]);
  


//   // Display the appropriate message or score based on the quiz type
//   const renderCompletionMessage = () => {
//     if (quizType === "Poll") {
//       return <h1>Thanks for participating in the poll!</h1>;
//     } else {
//       // Calculate score for other quiz types
//       let newScore = 0;
//       questions.forEach((question, index) => {
//         if (question.correctAnswer === selectedAnswers[index]) {
//           newScore += 1;
//         }
//       });

//       return (
//         <>
//           <h1>Congrats! Quiz is completed</h1>
//           <img src={image} alt="" />
//           <p>
//             Your Score: {newScore}/{questions.length}
//           </p>
//         </>
//       );
//     }
//   };

//   return (
//     <div className="wrap">
//       {quizCompleted ? (
//         <div className="quiz-completed-container">
//           {renderCompletionMessage()}
//         </div>
//       ) : (
//         <div className="quiz-container">
//           {questions.length > 0 ? (
//             <div className="question-card">
//               <div className="question-header">
//                 <div className="question-number">
//                   Question {currentQuestionIndex + 1}/{questions.length}
//                 </div>
//               </div>
//               <div className="question-text">
//                 {questions[currentQuestionIndex].question}
//               </div>
//               <div className="options-container">
//                 {renderOptions(
//                   questions[currentQuestionIndex].options,
//                   currentQuestionIndex
//                 )}
//               </div>
//               <button className="next-button" onClick={goToNextQuestion}>
//                 {currentQuestionIndex === questions.length - 1
//                   ? "Finish"
//                   : "Next"}
//               </button>
//             </div>
//           ) : (
//             <p>Loading questions...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizQuestions;








import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./QuizQuestions.css"; // Ensure this path is correct
import image from "./image.png";

const QuizQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizType, setQuizType] = useState(null);
  const [totalImpressions, setTotalImpressions] = useState(0);

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
        if (questionsArray.length > 0) {
          setQuizType(questionsArray[0].quizType);
        }
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

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  }, [currentQuestionIndex, questions.length]);

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

  useEffect(() => {
    if (quizCompleted) {
      // Increase impression count only when the quiz is completed
      fetch(`http://localhost:5000/api/quizzes/quiz/${quizId}/impression`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [quizId, quizCompleted]);

  useEffect(() => {
    // Fetch the total impression count for the specific quiz
    fetch(`http://localhost:5000/api/quizzes/${quizId}/total/impression`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((totalImpressionsData) => {
        setTotalImpressions(totalImpressionsData.totalImpressions);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [quizId]);

  // Display the appropriate message or score based on the quiz type
  const renderCompletionMessage = () => {
    if (quizType === "Poll") {
      return <h1>Thanks for participating in the poll!</h1>;
    } else {
      let newScore = 0;
      questions.forEach((question, index) => {
        if (question.correctAnswer === selectedAnswers[index]) {
          newScore += 1;
        }
      });

      return (
        <>
          <h1>Congrats! Quiz is completed</h1>
          <img src={image} alt="" />
          <p>
            Your Score: {newScore}/{questions.length}
          </p>
        
        </>
      );
    }
  };

  return (
    <div className="wrap">
      <div className="impression-count">
        Total Impressions for Quiz {quizId}: {totalImpressions}
      </div>
      {quizCompleted ? (
        <div className="quiz-completed-container">
          {renderCompletionMessage()}
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
                {questions[currentQuestionIndex].question}
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

export default QuizQuestions;
