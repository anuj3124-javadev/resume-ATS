import React from 'react';
import '../styles/loader.css';

const Loader = ({ message = 'Loading...', size = 'medium' }) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80
  };

  const loaderSize = sizeMap[size] || 60;

  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <div 
          className="loader-spinner"
          style={{ width: loaderSize, height: loaderSize }}
        >
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
        </div>
        {message && <div className="loader-message">{message}</div>}
      </div>
    </div>
  );
};

export const InlineLoader = ({ color = 'var(--primary-color)' }) => {
  return (
    <div className="inline-loader">
      <div className="inline-loader-dot" style={{ backgroundColor: color }}></div>
      <div className="inline-loader-dot" style={{ backgroundColor: color }}></div>
      <div className="inline-loader-dot" style={{ backgroundColor: color }}></div>
    </div>
  );
};

export default Loader;