

// TestComponent.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const TestComponent = () => {
  const { quizId } = useParams();
  console.log(quizId);

  return <div>Check the console for the quizId</div>;
};

export default TestComponent;
