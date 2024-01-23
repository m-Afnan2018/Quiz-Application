// import React from 'react'
// import Register from './Components/Register/Register'

// function App() {
//   return (
//     <div>
//       <Register/>
//     </div>
//   )
// }

// export default App

import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Components/Homepage/Dashboard/Dashboard";
import Analytics from "./Components/Homepage/Analytics/Analytics";
import CreateQuiz from "./Components/Homepage/CreateQuiz/CreateQuiz";
import Logout from "./Components/Homepage/Logout/Logout";
import CreateQuestion from "./Components/Homepage/CreateQuestion/CreateQuestion";
import QuizQuestions from "./Components/Homepage/QuizQuestions/QuizQuestions";
import HomePage from "./Components/Homepage/Homepage/HomePage";
import QuizAnalysis from "./Components/Homepage/Analytics/Analytics";

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/analytics" element={<Analytics />} />
          <Route path="analytics/:quizId" element={<Analytics />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/createQuestion" element={<CreateQuestion />} />

          <Route path="/quiz/:quizId/" element={<QuizQuestions />} />
          <Route path="/create-question/:quizId" element={<CreateQuestion />} />

          <Route path="/dashboard/:quizId" element={<Dashboard />} />

          <Route
            path="/dashboard"
            element={<HomePage defaultActive="dashboard" />}
          />
          <Route
            path="/analytics"
            element={<HomePage defaultActive="analytics" />}
          />
          <Route
            path="/createQuiz"
            element={<HomePage defaultActive="createQuiz" />}
          />
          <Route path="/quiz-analysis/:quizId" element={<QuizAnalysis />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
