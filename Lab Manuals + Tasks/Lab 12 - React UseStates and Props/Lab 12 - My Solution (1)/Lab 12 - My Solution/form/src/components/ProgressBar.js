import React from 'react';
import './ProgressBar.css';
const ProgressBar = ({ step = 1, totalSteps = 4 }) => {
  // Ensure both step and totalSteps are properly initialized
  const progress = totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;
  
  const getColor = () => {
    if (progress < 25) return 'red';
    if (progress < 50) return 'yellow';
    if (progress < 75) return 'blue';
    return 'green';
  };

  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%`, backgroundColor: getColor() }}>
        {Math.floor(progress)}%
      </div>
    </div>
  );
};

export default ProgressBar;

