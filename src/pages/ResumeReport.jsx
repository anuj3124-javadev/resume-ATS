import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import ScoreCircle from '../components/ScoreCircle';
import Loader from '../components/Loader';
import '../styles/report.css';

const ResumeReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await resumeAPI.getResume(id);
        if (response.data.success) {
          setResume(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.deleteResume(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  if (loading) {
    return <Loader message="Loading resume report..." />;
  }

  if (!resume) {
    return (
      <div className="error-page">
        <h2>Resume not found</h2>
        <p>The resume you're looking for doesn't exist or you don't have permission to view it.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { analysis } = resume;

  return (
    <div className="report-page">
      <div className="container">
        {/* Header */}
        <div className="report-header">
          <div className="report-title">
            <h1>Resume Analysis Report</h1>
            <p className="report-subtitle">
              {resume.fileName} • Analyzed on {formatDate(resume.uploadedAt)}
            </p>
          </div>
          <div className="report-actions">
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              ← Back
            </button>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        </div>

        {/* Score Card */}
        <div className="score-card">
          <div className="score-display">
            <ScoreCircle score={resume.score} size={140} strokeWidth={12} />
          </div>
          <div className="score-details">
            <h2 className={`score-value ${getScoreColorClass(resume.score)}`}>
              {resume.score}% ATS Score
            </h2>
            <p className="score-description">
              Your resume is performing {resume.score >= 80 ? 'excellently' : resume.score >= 60 ? 'well' : 'fairly'} against Applicant Tracking Systems
            </p>
            <div className="score-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Skill Match</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill"
                    style={{ width: `${analysis.details.keyword_density}%` }}
                  ></div>
                </div>
                <span className="breakdown-value">{analysis.details.keyword_density}%</span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Length</span>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill"
                    style={{ width: `${analysis.details.total_words > 1200 ? 100 : (analysis.details.total_words / 12)}%` }}
                  ></div>
                </div>
                <span className="breakdown-value">{analysis.details.total_words} words</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="report-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'strengths' ? 'active' : ''}`}
            onClick={() => setActiveTab('strengths')}
          >
            Strengths
          </button>
          <button 
            className={`tab-button ${activeTab === 'improvements' ? 'active' : ''}`}
            onClick={() => setActiveTab('improvements')}
          >
            Improvements
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="card strengths-card">
                <h3>✅ Strengths</h3>
                <ul className="strengths-list">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="card weaknesses-card">
                <h3>⚠️ Areas for Improvement</h3>
                <ul className="weaknesses-list">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
              
              <div className="card suggestions-card full-width">
                <h3>💡 Recommendations</h3>
                <div className="suggestions-list">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="suggestion-item">
                      <div className="suggestion-number">{index + 1}</div>
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'strengths' && (
            <div className="card">
              <h3>Your Resume's Strengths</h3>
              <div className="strengths-details">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="strength-item">
                    <div className="strength-icon">✅</div>
                    <div className="strength-content">
                      <h4>Strength #{index + 1}</h4>
                      <p>{strength}</p>
                    </div>
                  </div>
                ))}
                {analysis.details.skills_found > 0 && (
                  <div className="keyword-strength">
                    <h4>Keyword Performance</h4>
                    <div className="keyword-stats">
                      <div className="keyword-stat">
                        <span className="stat-number">{analysis.details.skills_found}</span>
                        <span className="stat-label">Keywords Found</span>
                      </div>
                      <div className="keyword-stat">
                        <span className="stat-number">{analysis.details.keyword_density}%</span>
                        <span className="stat-label">Density</span>
                      </div>
                      <div className="keyword-stat">
                        <span className="stat-number">{analysis.details.experience_indicators}</span>
                        <span className="stat-label">Experience Indicators</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'improvements' && (
            <div className="improvements-grid">
              <div className="card">
                <h3>Missing Keywords</h3>
                <p>Consider adding these important keywords to your resume:</p>
                <div className="keywords-grid">
                  {analysis.missing_keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag missing">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3>Actionable Suggestions</h3>
                <ol className="suggestions-list">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <strong>Step {index + 1}:</strong> {suggestion}
                    </li>
                  ))}
                </ol>
              </div>
              
              <div className="card">
                <h3>Grammar & Style</h3>
                <div className="grammar-tips">
                  {analysis.details.grammar_score < 80 && (
                    <div className="grammar-alert">
                      <div className="alert-icon">⚠️</div>
                      <div>
                        <h4>Review Recommended</h4>
                        <p>Consider reviewing your resume for grammar and professional tone.</p>
                      </div>
                    </div>
                  )}
                  <div className="tip-list">
                    <div className="tip">
                      <div className="tip-icon">📝</div>
                      <div>
                        <h5>Use Action Verbs</h5>
                        <p>Start bullet points with strong action verbs like "Developed", "Managed", "Achieved"</p>
                      </div>
                    </div>
                    <div className="tip">
                      <div className="tip-icon">📏</div>
                      <div>
                        <h5>Optimal Length</h5>
                        <p>Aim for 400-800 words for best ATS performance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="details-grid">
              <div className="card">
                <h3>Detailed Statistics</h3>
                <div className="statistics-list">
                  <div className="stat-item">
                    <span className="stat-label">Total Words</span>
                    <span className="stat-value">{analysis.details.total_words}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Keywords Found</span>
                    <span className="stat-value">{analysis.details.skills_found} / {analysis.details.skills_total}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Keyword Density</span>
                    <span className="stat-value">{analysis.details.keyword_density}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Experience Indicators</span>
                    <span className="stat-value">{analysis.details.experience_indicators}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Grammar Score</span>
                    <span className="stat-value">{analysis.details.grammar_score}/100</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3>Score Breakdown</h3>
                <div className="score-components">
                  <div className="score-component">
                    <span className="component-label">Skill Match</span>
                    <div className="component-bar">
                      <div 
                        className="component-fill"
                        style={{ width: `${analysis.details.keyword_density}%` }}
                      ></div>
                    </div>
                    <span className="component-value">{analysis.details.keyword_density}%</span>
                  </div>
                  <div className="score-component">
                    <span className="component-label">Experience</span>
                    <div className="component-bar">
                      <div 
                        className="component-fill"
                        style={{ width: `${Math.min(100, analysis.details.experience_indicators * 10)}%` }}
                      ></div>
                    </div>
                    <span className="component-value">{analysis.details.experience_indicators} indicators</span>
                  </div>
                  <div className="score-component">
                    <span className="component-label">Length</span>
                    <div className="component-bar">
                      <div 
                        className="component-fill"
                        style={{ width: `${analysis.details.total_words > 1200 ? 100 : (analysis.details.total_words / 12)}%` }}
                      ></div>
                    </div>
                    <span className="component-value">{analysis.details.total_words} words</span>
                  </div>
                  <div className="score-component">
                    <span className="component-label">Grammar</span>
                    <div className="component-bar">
                      <div 
                        className="component-fill"
                        style={{ width: `${analysis.details.grammar_score}%` }}
                      ></div>
                    </div>
                    <span className="component-value">{analysis.details.grammar_score}/100</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3>What This Means</h3>
                <div className="interpretation">
                  <h4>ATS Compatibility</h4>
                  <p>
                    Applicant Tracking Systems scan resumes for keywords and format. 
                    {resume.score >= 80 
                      ? ' Your resume shows excellent compatibility with most ATS systems.' 
                      : resume.score >= 60 
                      ? ' Your resume has good compatibility but could be further optimized.' 
                      : ' Your resume may face challenges with ATS parsing.'}
                  </p>
                  
                  <h4>Next Steps</h4>
                  <ul>
                    <li>Review missing keywords and incorporate relevant ones</li>
                    <li>Ensure proper formatting with clear section headings</li>
                    <li>Use standard file formats (PDF recommended)</li>
                    <li>Include quantifiable achievements</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="cta-card">
          <div className="cta-content">
            <h3>Want to improve your score?</h3>
            <p>Upload an updated version of your resume to track improvements over time.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Upload New Version
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeReport;