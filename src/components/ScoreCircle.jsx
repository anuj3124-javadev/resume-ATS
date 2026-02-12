import React, { useState, useEffect } from 'react';
import '../styles/scoreCircle.css';

const ScoreCircle = ({ score, size = 120, strokeWidth = 10, animate = true }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  useEffect(() => {
    if (animate) {
      let start = 0;
      const end = score;
      const duration = 1500;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setAnimatedScore(Math.floor(start));
      }, 16);
      return () => clearInterval(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animate]);

  return (
    <div className="score-circle-container">
      <div className="score-circle-wrapper" style={{ width: size, height: size }}>
        <svg className="score-circle-svg" width={size} height={size}>
          <circle
            className="score-circle-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#e5e7eb"
            fill="transparent"
          />
          <circle
            className="score-circle-progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={getScoreColor(animatedScore)}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="score-circle-content">
          <div className="score-circle-value" style={{ color: getScoreColor(animatedScore) }}>
            {animatedScore}
            <span className="score-circle-percent">%</span>
          </div>
          <div className="score-circle-label">{getScoreText(animatedScore)}</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;