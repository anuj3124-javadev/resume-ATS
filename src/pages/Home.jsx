import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Optimize Your Resume for
                <span className="gradient-text"> ATS Success</span>
              </h1>
              <p className="hero-subtitle">
                Get instant ATS scoring, keyword analysis, and professional suggestions 
                to make your resume stand out to recruiters and hiring managers.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn-hero-primary">
                  Start Free Analysis
                </Link>
                <Link to="/login" className="btn-hero-secondary">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-card">
                <div className="card-score">
                  <div className="score-value">94</div>
                  <div className="score-label">ATS Score</div>
                </div>
                <div className="card-stats">
                  <div className="stat-item">
                    <span className="stat-number">25</span>
                    <span className="stat-label">Keywords</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Powerful Resume Analysis</h2>
          <p className="section-subtitle">
            Get detailed insights to improve your resume's performance
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Keyword Analysis</h3>
              <p className="feature-description">
                Identify missing keywords and optimize your resume for specific job roles.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">ATS Scoring</h3>
              <p className="feature-description">
                Get a comprehensive ATS score with detailed breakdown and improvement suggestions.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Quick Analysis</h3>
              <p className="feature-description">
                Upload and get results in seconds. Support for PDF, DOC, and DOCX formats.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3 className="feature-title">History Tracking</h3>
              <p className="feature-description">
                Save and compare your resume versions to track improvement over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Optimize Your Resume?</h2>
            <p className="cta-description">
              Join thousands of job seekers who improved their resume scores and landed interviews.
            </p>
            <Link to="/register" className="btn-cta">
              Get Started For Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;