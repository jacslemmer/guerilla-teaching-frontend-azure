import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import GuerillaLogo from '../assets/Guerilla-teaching-logo.png';
import './Webinars.css';

const Webinars: React.FC = () => {
  return (
    <div className="webinars">
      <PageHeader 
        title="Live Lessons and Webinars" 
        subtitle=""
      />
      
      <div className="container">
        <div className="webinars-content">
          {/* Main Content Section */}
          <div className="webinars-main">
            <h2>Live Lessons and Webinars</h2>
            
            {/* Logo Section */}
            <div className="logo-section">
              <div className="logo-container">
                <img src={GuerillaLogo} alt="Guerilla Teaching Logo" className="webinars-logo" />
              </div>
            </div>
            
            {/* Loading/No Meetings Section */}
            <div className="meetings-status">
              <p className="loading-text">loading...</p>
              <p className="no-meetings">No Meetings found.</p>
            </div>
          </div>

          {/* Comment Section */}
          <div className="comment-section">
            <h3>Leave your thought here</h3>
            <div className="comment-form">
              <p className="form-note">
                Your email address will not be published. Required fields are marked <span className="required">*</span>
              </p>
              
              <form className="webinar-comment-form">
                <div className="form-group">
                  <label htmlFor="comment">Comment *</label>
                  <textarea 
                    id="comment" 
                    name="comment" 
                    rows={6} 
                    placeholder="Leave your comment here..."
                    required
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input type="text" id="name" name="name" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input type="url" id="website" name="website" />
                  </div>
                </div>
                
                <div className="form-checkbox">
                  <input type="checkbox" id="save-info" name="save-info" />
                  <label htmlFor="save-info">
                    Save my name, email, and website in this browser for the next time I comment.
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Post Comment</button>
                  <button type="button" className="cancel-btn">Cancel reply</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webinars;