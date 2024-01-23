





import React, { useState } from 'react';
import './CreateQuiz.css';
import { useNavigate } from 'react-router-dom';

const QuizForm = ({ onClose, onContinue }) => {
  const [quizName, setQuizName] = useState('');
  const [quizType, setQuizType] = useState('');
  const [isVisible, setIsVisible] = useState(true); // New state to control visibility
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    // Update the quizName state with the input value
    setQuizName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setQuizType(e.target.value);
  };

  const handleCancel = () => {
    // Logic to close the popup
    setIsVisible(false);
    onClose && onClose(); // Call onClose prop if provided
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quizName.trim() && quizType) {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Assuming the user's ID is stored in local storage
        if (!token) {
          alert('You must be logged in to create a quiz.');
          return;
        }
        const response = await fetch(`http://localhost:5000/api/quizzes/user/${userId}/quizzes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: quizName,
            type: quizType,
          }),
        });


        const data = await response.json();

        if (response.ok) {
          // If the request was successful, navigate to the CreateQuestion component
          const newQuizId = data._id; // Assuming the backend 
        localStorage.setItem('newQuizId', newQuizId);
          navigate(`/create-question/${newQuizId}`, { state: { quizType, quizName } });
  
        } else {
          // If the server responded with an error, handle it here
          alert(`Failed to create quiz: ${data.message}`);
        }
      } catch (error) {
        // Handle network errors here
        alert(`Network error: ${error.message}`);
      }
    } else {
      alert('Please fill in the quiz name and select a quiz type.');
    }
  };

  // If the form is not meant to be visible, return null or some other logic to hide it
  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="quiz-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={quizName}
              onChange={handleNameChange}
              placeholder="Quiz name"
              className="quiz-name-input"
            />
          </div>
          <div className="form-group">
            Quiz Type
            <label>
              <input
                type="radio"
                name="quizType" // add name attribute for proper radio button grouping
                value="Q&A"
                checked={quizType === 'Q&A'}
                onChange={handleTypeChange}
              />
              Q & A
            </label>
            <label>
              <input
                type="radio"
                name="quizType" // add name attribute for proper radio button grouping
                value="Poll"
                checked={quizType === 'Poll'}
                onChange={handleTypeChange}
              />
              Poll Type
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className=" can-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className=" cont-btn continue-button">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
