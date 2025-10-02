import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import AnimatedCounter from '../components/AnimatedCounter';
import './OurClients.css';

// Import images
import VictoriaLockImage from '../assets/Victoria-Locke.jpeg';
import VictoriaImage from '../assets/Victoria.jpeg';
import TreeImage from '../assets/Tree-image.jpeg';
import AcademyLogo from '../assets/Academy-Logo.jpeg';
import SummerhillLogo from '../assets/Summerhill-logo.png';
import GuerillaLogo from '../assets/Guerilla-teaching-logo.png';

const OurClients: React.FC = () => {
  return (
    <div className="our-clients">
      <PageHeader 
        title="Our Clients" 
        subtitle=""
      />
      
      <div className="container">
        {/* Dan Landi Quote Section */}
        <div className="founder-quote-section">
          <div className="quote-content">
            <p className="founder-quote">
              Experience a unique blend of sound traditional teaching methodologies with the latest Virtual Learning Environments and Learning Management Systems.
            </p>
            <div className="founder-attribution">
              <strong>DAN LANDI</strong>
              <span>/ Founder</span>
            </div>
          </div>
        </div>

        {/* Stats Header */}
        <div className="stats-header">
          <div className="stat-item">
            <AnimatedCounter 
              end={350} 
              suffix="+" 
              duration={2500}
              className="stat-number"
            />
            <div className="stat-label">REGISTERED ENROLMENTS</div>
          </div>
          <div className="stat-item">
            <AnimatedCounter 
              end={2569} 
              duration={3000}
              className="stat-number"
            />
            <div className="stat-label">COMPLETED COURSES</div>
          </div>
          <div className="stat-item">
            <AnimatedCounter 
              end={98} 
              suffix="%" 
              duration={2000}
              className="stat-number"
            />
            <div className="stat-label">SATISFACTION RATE</div>
          </div>
        </div>

        <div className="clients-content">
          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Victoria Lock Card */}
            <div className="testimonial-card large-card">
              <div className="profile-section">
                <div className="profile-image">
                  <img src={VictoriaLockImage} alt="Victoria Lock" />
                </div>
                <div className="profile-info">
                  <h4>VICTORIA LOCK</h4>
                </div>
              </div>
              <div className="testimonial-content">
                <p>
                  I really love The Academy Online because they allow me to not only 
                  learn at my own pace, but give me the one on one experience that I 
                  think every student needs. This is an amazing way to go to school.
                </p>
              </div>
            </div>

            {/* Rating Card */}
            <div className="rating-card">
              <AnimatedCounter 
                end={4.55} 
                decimals={2}
                duration={2000}
                className="rating-number"
              />
              <div className="stars">★★★★★</div>
              <div className="rating-label">by <AnimatedCounter end={250} suffix="+" duration={2000} className="inline-counter" /> Students</div>
            </div>

            {/* Academy Online Logo Card */}
            <div className="academy-card">
              <div className="academy-logo">
                <img src={AcademyLogo} alt="The Academy Online" className="academy-logo-img" />
              </div>
              <div className="academy-tagline">
                ONE OF THE FIRST ONLINE SCHOOLS
              </div>
            </div>

            {/* Second Victoria Testimonial */}
            <div className="testimonial-card secondary-card">
              <div className="profile-section">
                <div className="profile-image small">
                  <img src={VictoriaImage} alt="Victoria" />
                </div>
              </div>
              <div className="testimonial-content">
                <p>
                  I am free to learn at my own pace, follow my own schedule and choose the subjects I 
                  want to learn. Great study portal for independent learners!
                </p>
                <div className="author-name">VICTORIA</div>
                <div className="author-role">IGCSE Student</div>
              </div>
            </div>

            {/* User Interface Card */}
            <div className="interface-card">
              <h3>Students Enjoy User Interface with The Academy Online</h3>
              <p>
                Our first Virtual Learning Environment, The Academy Online was years ahead of its time. 
                Established in 2015, long before COVID necessitated the move to online learning, The Academy Online was paving the way!
              </p>
              <a 
                href="https://theacademyonline.co.za" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="visit-btn"
              >
                Visit The Academy Online
              </a>
            </div>

            {/* Quote Card */}
            <div className="quote-card">
              <p>"Even when you don't succeed never give up and you'll strive to be the best you can be"</p>
            </div>
          </div>

          {/* Our Services Section */}
          <div className="our-services-section">
            <h2>OUR SERVICES</h2>
            <div className="services-grid">
              <div className="service-item">
                <div className="service-icon">
                  <div className="icon-placeholder">💻</div>
                </div>
                <h3>1. Remote Learning</h3>
                <p>
                  Learn from anywhere in the world on desktop, tablet or mobile phone with an Internet connection. 
                  Our Learning Portal provides Pearson Edexcel IGCSE and IAS courses for examination success. 
                  Available on subscription to individuals, or by license to Tutors.
                </p>
                <button className="service-btn">Teach or Learn from Anywhere</button>
              </div>

              <div className="service-item">
                <div className="service-icon">
                  <div className="icon-placeholder">🏫</div>
                </div>
                <h3>2. Examination Preparation</h3>
                <p>
                  Expert teaching and assessment, including MOCK examinations for International GCSE and AS Levels, 
                  accepted by local and International Universities world wide.
                </p>
                <button className="service-btn">Boost Grades with Expert Help</button>
              </div>

              <div className="service-item">
                <div className="service-icon">
                  <div className="icon-placeholder">📚</div>
                </div>
                <h3>3. Curriculum Design</h3>
                <p>
                  Bespoke Learning Resources and Virtual Learning Environments tailored for your specific needs. 
                  Moodle experts will design your schools VLE improving learning outcomes for your high school students.
                </p>
                <button className="service-btn">Virtual Classrooms Built for You</button>
              </div>

              <div className="service-item">
                <div className="service-icon">
                  <div className="icon-placeholder">👨‍🏫</div>
                </div>
                <h3>4. Consultancy</h3>
                <p>
                  Navigating the challenges of international examinations, Matric Exemption, the Two sitting Rule 
                  and University entrance requirements.
                </p>
                <button className="service-btn">Get Expert Guidance Now</button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Redesigned Layout */}
          <div className="bottom-section">
            {/* First Row - Guerilla Teaching Section */}
            <div className="guerilla-section">
              {/* Prominent Logo Section */}
              <div className="guerilla-logo-card">
                <div className="guerilla-logo-container">
                  <img src={GuerillaLogo} alt="Guerilla Teaching Logo" className="guerilla-logo-prominent" />
                </div>
              </div>
              
              {/* Tagline Section */}
              <div className="guerilla-tagline-card">
                <p>LEARNER MANAGEMENT AND CAPACITY DEVELOPMENT</p>
              </div>
              
              {/* Content Section */}
              <div className="guerilla-content-card">
                <h2>Bespoke Content Creation and Curriculum Design with Guerilla Teaching</h2>
                <p>
                  As expert Curriculum Designers, we can design and deliver bespoke Virtual Learning 
                  Environments to suit the needs of Individuals, Tutors, Teachers and Schools.
                </p>
              </div>
            </div>

            {/* Second Row - Summerhill and Values */}
            <div className="bottom-row">
              {/* Summerhill Logos Card */}
              <div className="summerhill-logos-card">
                <div className="summerhill-logos">
                  <img src={SummerhillLogo} alt="Summerhill College Logo" className="summerhill-logo" />
                </div>
                <div className="summerhill-text">
                  <h4>OUR MISSION is to provide centralised quality control, learner engagement, accurate reporting and capacity development to Summerhill College's Cambridge Cohort</h4>
                </div>
                <div className="summerhill-details">
                  <h3>Summerhill College</h3>
                  <p>Bespoke Virtual Learning Environment</p>
                  <ul>
                    <li>Cambridge iGCSE</li>
                    <li>Cambridge AS Levels</li>
                  </ul>
                </div>
              </div>

              {/* Values Tree Card */}
              <div className="values-tree-card">
                <div className="tree-section">
                  <img src={TreeImage} alt="Tree with lemon" className="tree-icon-large" />
                </div>
                <div className="values-text">
                  <h3>OUR VALUES</h3>
                  <blockquote>
                    "The true meaning of life is to plant trees under whose shade you do not expect to sit."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurClients;