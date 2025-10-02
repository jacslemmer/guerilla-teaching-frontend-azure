import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';
import PageHeader from '../components/PageHeader';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      <PageHeader 
        title="About Us" 
        subtitle="Revolutionizing Education Through Innovation" 
      />
      
      <div className="about-us-content">
        <div className="intro-section">
          <h2>Welcome to Guerilla Teaching</h2>
          <p>
            We are a passionate team of educators, innovators, and change-makers dedicated to 
            transforming the educational landscape. Our mission is to make quality education 
            accessible, engaging, and effective for learners worldwide.
          </p>
        </div>

        <div className="sub-pages-grid">
          <div className="sub-page-card">
            <div className="card-icon">🎯</div>
            <h3>Our Ethos</h3>
            <p>
              Discover the core values and principles that drive our educational philosophy 
              and shape everything we do.
            </p>
            <Link to="/about-us/our-ethos" className="btn-primary">
              Learn About Our Ethos
            </Link>
          </div>

          <div className="sub-page-card">
            <div className="card-icon">👥</div>
            <h3>Our Clients</h3>
            <p>
              Meet the diverse community of learners, educators, and institutions who trust 
              us with their educational journey.
            </p>
            <Link to="/about-us/our-clients" className="btn-primary">
              Meet Our Clients
            </Link>
          </div>
        </div>

        {/* Our Impact section removed */}
      </div>
    </div>
  );
};

export default AboutUs; 