import React from 'react';
import { Link } from 'react-router-dom';
import './Resources.css';
import PageHeader from '../components/PageHeader';

const Resources: React.FC = () => {
  return (
    <div className="resources">
      <PageHeader 
        title="Resources" 
        subtitle="Access our comprehensive collection of educational materials, insights, and learning tools" 
      />
      
      <div className="content-section">
        <div className="container">
          <div className="resources-intro">
            <h2>Educational Resources Hub</h2>
            <p>Discover a wealth of educational content designed to support your learning journey. From in-depth articles to interactive webinars, our resources are crafted to enhance your understanding and academic success.</p>
          </div>
          
          <div className="resources-grid">
            <Link to="/resources/articles" className="resource-card clickable-card">
              <div className="resource-icon">📚</div>
              <h3>Articles</h3>
              <p>In-depth educational articles covering study techniques, subject-specific insights, exam preparation strategies, and academic success tips.</p>
              <div className="resource-features">
                <span>Study Tips</span>
                <span>Exam Prep</span>
                <span>Subject Guides</span>
              </div>
              <div className="resource-link-text">
                Browse Articles
              </div>
            </Link>
            
            <Link to="/resources/webinars" className="resource-card clickable-card">
              <div className="resource-icon">🎥</div>
              <h3>Webinars</h3>
              <p>Interactive online sessions with expert educators covering current topics, study strategies, and live Q&A opportunities.</p>
              <div className="resource-features">
                <span>Live Sessions</span>
                <span>Expert Speakers</span>
                <span>Q&A Sessions</span>
              </div>
              <div className="resource-link-text">
                View Webinars
              </div>
            </Link>
          </div>
          
          <div className="resources-features">
            <h2>Why Our Resources Matter</h2>
            <div className="features-grid-row">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h4>Expert Knowledge</h4>
                <p>Content created by qualified educators with years of experience in international education.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <h4>Proven Results</h4>
                <p>Strategies and techniques that have helped thousands of students achieve academic success.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔄</div>
                <h4>Regular Updates</h4>
                <p>Fresh content added regularly to keep you informed about the latest educational trends and methods.</p>
              </div>
            </div>
            <div className="features-grid-center">
              <div className="feature-item">
                <div className="feature-icon">💡</div>
                <h4>Practical Insights</h4>
                <p>Actionable advice and real-world applications that you can implement immediately.</p>
              </div>
            </div>
          </div>
          
          <div className="cta-section">
            <h3>Ready to Enhance Your Learning?</h3>
            <p>Explore our resources and take your academic journey to the next level</p>
            <div className="cta-buttons">
              <Link to="/resources/articles" className="cta-button primary">
                Read Articles
              </Link>
              <Link to="/resources/webinars" className="cta-button secondary">
                Join Webinars
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources; 