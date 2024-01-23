import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css"; // Import the CSS file

const Login = ({ onLogin }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!user.email) tempErrors.email = "Email is required";
    if (!user.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) {
            // If login is unsuccessful, throw an error with the status
            throw new Error(`Login failed with status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          localStorage.setItem('token', data.token); // Store the token in local storage
          localStorage.setItem('userId', data.userId); // Store the user ID in local storage
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Invalid email or password"); // Displaying the toast notification
        });
    }
  };
  


  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        className={errors.email ? "input-error" : "input"}
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder={errors.email || "Email"}
      />
      <input
        className={errors.password ? "input-error" : "input"}
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder={errors.password || "Password"}
      />
      <button className="submit-button" type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
