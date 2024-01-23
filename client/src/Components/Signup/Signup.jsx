import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Signup.css'; // Import the CSS file

const Signup = ({ onSignup }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errors = {};
  
    // Validate name
    if (!user.name) {
      errors.name = "Name is required";
    }
  
    // Validate email
    if (!user.email) {
      errors.email = "Email is required";
    } else if (!user.email.includes('@')) {
      errors.email = "Invalid Email";
    }
  
    // Validate password
    if (!user.password) {
      errors.password = "Password is required";
    } else if (user.password.length < 4) {
      errors.password = "Weak password";
    }
  
    // Validate confirm password
    if (!user.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (user.password !== user.confirmPassword) {
      errors.confirmPassword = "Password doesn't match";
    }
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            toast.error("User already exists");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        navigate('/login');
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <input
        className={errors.name ? "input-error" : "input"}
        type="text"
        name="name"
        value={user.name}
        onChange={handleChange}
        placeholder={errors.name || "Name"}
      />
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
      <input
        className={errors.confirmPassword ? "input-error" : "input"}
        type="password"
        name="confirmPassword"
        value={user.confirmPassword}
        onChange={handleChange}
        placeholder={errors.confirmPassword || "Confirm Password"}
      />
      <button className="submit-button" type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
