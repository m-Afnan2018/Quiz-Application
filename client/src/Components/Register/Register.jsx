import { useState } from "react";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import "./Register.css";

const Register = () => {
  // Initialize show state to 'signup' to show the Signup component by default
  const [show, setShow] = useState("signup");

  const handleSignup = (user) => {
    console.log("Signup:", user);
    // Handle signup logic here
  };

  const handleLogin = (user) => {
    console.log("Login:", user);
    // Handle login logic here
  };

  return (
    <div className="register-container">
      <div className="register-header">QUIZZIE</div>
      <div className="register-buttons">
        <button
          className={`register-button ${show === "signup" ? "active" : ""}`}
          onClick={() => setShow("signup")}
        >
          Sign Up
        </button>
        <button
          className={`register-button ${show === "login" ? "active" : ""}`}
          onClick={() => setShow("login")}
        >
          Log In
        </button>
      </div>
      {show === "signup" && <Signup onSignup={handleSignup} />}
      {show === "login" && <Login onLogin={handleLogin} />}
    </div>
  );
};

export default Register;
