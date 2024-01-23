import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  // State for storing data
  const [createdQuizzes, setCreatedQuizzes] = useState(0);
  const [createdQuestions, setCreatedQuestions] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);

  const { quizId } = useParams();
 console.log(quizId)
  // Function to fetch data from the backend
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const quizzesUrl = `http://localhost:5000/api/quizzes/user/${userId}/quizzes`;
      // const questionsUrl = `http://localhost:5000/api/quizzes/${quizId}/questions`;
      const questionsUrl = `http://localhost:5000/api/questions/`;
      const trendingUrl = `http://localhost:5000/api/quizzes/user/${userId}/trending`;

      // Fetch quizzes, questions, and trending quizzes in parallel
      const [quizRes, questionRes, trendingRes] = await Promise.all([
        fetch(quizzesUrl, { headers: authHeaders }),
        fetch(questionsUrl, { headers: authHeaders }),
        fetch(trendingUrl, { headers: authHeaders }),
      ]);

      // Process quizzes response
      const quizData = await quizRes.json();
      setCreatedQuizzes(quizData.length || 0);

      // Process questions response
      const questionsData = await questionRes.json();
      console.log('Question Data: ', questionsData);
      setCreatedQuestions(questionsData.length);

      // Process trending quizzes response
      const trendingData = await trendingRes.json();
      const quizzesWithFormattedDates = trendingData.quizzes.map((quiz) => ({
        ...quiz,
        createdOn: new Date(quiz.createdOn).toLocaleDateString(),
      }));
      setTrendingQuizzes(quizzesWithFormattedDates || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchQuizAndIncrementImpressions = async () => {
    if (!quizId) return; // Exit if no quizId is provided

    const quizUrl = `http://localhost:5000/api/quizzes/${quizId}/impression`;
    console.log("Fetching and incrementing impressions for URL:", quizUrl);
    try {
      const quizResponse = await fetch(quizUrl); // Removed the auth headers, GET is default method
      const quizData = await quizResponse.json();

      if (quizData) {
        setTotalImpressions(quizData.impressions || 0);
      } else {
        console.error("Quiz data not found");
      }
    } catch (error) {
      console.error("Error fetching and incrementing quiz impressions:", error);
    }
  };

  // useEffect to call fetchData and fetchQuizAndIncrementImpressions on component mount
  useEffect(() => {
    fetchData();
    fetchQuizAndIncrementImpressions();
  }, [quizId]);

  return (
    <div className="dashboard">
      <h1>QUIZZIE</h1>
      <div className="statistics">
        <div className="stat">
          <p>{createdQuizzes}</p>
          <p>Quizzes Created</p>
        </div>
        <div className="stat">
          <p>{createdQuestions}</p>
          <p>Questions Created</p>
        </div>
        <div className="stat">
          <p>{totalImpressions}K</p>
          <p>Total Impressions</p>
        </div>
      </div>
      <div className="trending-quizzes">
        <h2>Trending Quizzes</h2>
        <ul className="quiz-list">
          {trendingQuizzes.map((quiz) => (
            <li key={quiz._id}>
              <h3>{quiz.name}</h3>
              <p>Created on: {quiz.createdOn}</p>
              {/* Display the number of impressions if available */}
              <p>Impressions: {quiz.impressions || "N/A"}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
