import React, { useState } from "react";
import "./HomePage.css"; // Import regular CSS file
import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Analytics from "../Analytics/Analytics";
import CreateQuiz from "../CreateQuiz/CreateQuiz";

function HomePage() {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const navigate = useNavigate();
  const getButtonClass = (name) => {
    return `button ${activeComponent === name ? "active" : ""}`;
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "analytics":
        return <Analytics />;
      case "createQuiz":
        return <CreateQuiz />;
      default:
        return <div>Welcome to the homepage!</div>;
    }
  };

  return (
    <div className="homePageContainer">
      <div className="sidebar">
        <div className="title">
          <h2>QUIZZIE</h2>
        </div>
        <button
          className={getButtonClass("dashboard")}
          // onClick={() => setActiveComponent("dashboard")}
          onClick={() => {
            setActiveComponent('dashboard');
            navigate('/dashboard'); // Update URL to /dashboard
          }}
        >
          Dashboard
        </button>
        <button
          className={getButtonClass("analytics")}
          // onClick={() => setActiveComponent("analytics")}
          onClick={()=>{
            setActiveComponent('Analytics');
            navigate('/analytics')
          }}
        >
          Analytics
        </button>
        <button
          className={getButtonClass("createQuiz")}
          onClick={() => setActiveComponent("createQuiz")}
        >
          Create Quiz
        </button>
        <button
          className="button logout-btn"
          onClick={() => setActiveComponent("")}
        >
          Logout
        </button>
      </div>
      <div className="content">{renderComponent()}</div>
    </div>
  );
}

export default HomePage;


