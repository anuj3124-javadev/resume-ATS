import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreCircle from './ScoreCircle';
import '../styles/resumeCard.css';

const ResumeCard = ({ resume, onDelete }) => {
  const navigate = useNavigate();
  const uploadedDate = new Date(resume.uploadedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleViewReport = () => {
    navigate(`/report/${resume.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume?')) {
      onDelete(resume.id);
    }
  };

  return (
    <div className="resume-card">
      <div className="resume-card-header">
        <div className="resume-file-info">
          <div className="file-icon">📄</div>
          <div>
            <h3 className="file-name">{resume.fileName}</h3>
            <p className="upload-date">Uploaded on {uploadedDate}</p>
          </div>
        </div>
        <div className="resume-score">
          <ScoreCircle score={resume.score} size={80} strokeWidth={8} animate={false} />
        </div>
      </div>
      
      <div className="resume-card-body">
        <div className="resume-stats">
          <div className="stat">
            <span className="stat-label">Keywords Found</span>
            <span className="stat-value">{resume.analysis.details.skills_found}</span>
          </div>
          {/* <div className="stat">
            <span className="stat-label">Words</span>
            <span className="stat-value">{resume.analysis.details.total_words}</span>
          </div> */}
          <div className="stat">
            <span className="stat-label">Experience</span>
            <span className="stat-value">{resume.analysis.details.experience_indicators}</span>
          </div>
        </div>
        
        <div className="resume-strengths">
          {resume.analysis.strengths.slice(0, 2).map((strength, index) => (
            <span key={index} className="strength-tag">
              ✅ {strength}
            </span>
          ))}
        </div>
      </div>
      
      <div className="resume-card-footer">
        <button onClick={handleViewReport} className="btn-view-report">
          View Full Report
        </button>
        <button onClick={handleDelete} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;