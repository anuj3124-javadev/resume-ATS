import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import ResumeCard from '../components/ResumeCard';
import Loader from '../components/Loader';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getMyResumes();
      if (response.data.success) {
        setResumes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to load resumes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PDF, DOC, or DOCX file');
      return;
    }
    
    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('resume', selectedFile);
    
    setUploading(true);
    setError('');
    
    try {
      const response = await resumeAPI.upload(formData);
      if (response.data.success) {
        // Add new resume to the list
        setResumes(prev => [response.data.data, ...prev]);
        setShowUploadModal(false);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      await resumeAPI.deleteResume(id);
      // Remove deleted resume from state
      setResumes(prev => prev.filter(resume => resume.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete resume');
    }
  };

  const getStats = () => {
    if (resumes.length === 0) return {};
    
    const totalScore = resumes.reduce((sum, resume) => sum + resume.score, 0);
    const averageScore = Math.round(totalScore / resumes.length);
    const bestScore = Math.max(...resumes.map(r => r.score));
    const totalKeywords = resumes.reduce((sum, resume) => sum + resume.analysis.details.skills_found, 0);
    
    return {
      averageScore,
      bestScore,
      totalResumes: resumes.length,
      totalKeywords,
      lastUpload: resumes[0]?.uploadedAt
    };
  };

  const stats = getStats();

  if (loading && resumes.length === 0) {
    return <Loader message="Loading your dashboard..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Resume Dashboard</h1>
            <p className="dashboard-subtitle">
              Track and optimize your resume performance
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-upload"
          >
            <span className="upload-icon">📤</span>
            Upload Resume
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.averageScore || 0}%</h3>
              <p className="stat-label">Average ATS Score</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.bestScore || 0}%</h3>
              <p className="stat-label">Best Score</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalResumes}</h3>
              <p className="stat-label">Total Resumes</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔑</div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.totalKeywords}</h3>
              <p className="stat-label">Keywords Found</p>
            </div>
          </div>
        </div>

        {/* Resumes List */}
        <div className="resumes-section">
          <div className="section-header">
            <h2>Your Resumes</h2>
            <p className="section-subtitle">
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''} analyzed
            </p>
          </div>
          
          {error && (
            <div className="error-banner">
              {error}
              <button onClick={() => setError('')} className="close-error">×</button>
            </div>
          )}
          
          {resumes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No Resumes Yet</h3>
              <p>Upload your first resume to get ATS scoring and optimization suggestions.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                Upload Your First Resume
              </button>
            </div>
          ) : (
            <div className="resumes-grid">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDeleteResume}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => !uploading && setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Resume</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="modal-close"
                disabled={uploading}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div
                className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="file-input"
                  disabled={uploading}
                />
                <label htmlFor="resume-upload" className="upload-label">
                  {selectedFile ? (
                    <div className="selected-file">
                      <div className="file-icon">📄</div>
                      <div className="file-info">
                        <div className="file-name">{selectedFile.name}</div>
                        <div className="file-size">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="remove-file"
                        disabled={uploading}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📤</div>
                      <div className="upload-text">
                        <h3>Drop your resume here</h3>
                        <p>or click to browse</p>
                      </div>
                      <div className="upload-hint">
                        Supports PDF, DOC, DOCX • Max 5MB
                      </div>
                    </>
                  )}
                </label>
              </div>
              
              {error && (
                <div className="modal-error">{error}</div>
              )}
              
              <div className="modal-actions">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="btn-primary"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Resume'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;