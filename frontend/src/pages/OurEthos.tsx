import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import './OurEthos.css';

const OurEthos: React.FC = () => {
  return (
    <div className="our-ethos">
      <PageHeader 
        title="Our Ethos" 
        subtitle="Learn Without Limits"
      />
      
      <div className="container">
        <div className="ethos-content">
          {/* Main Ethos Statement */}
          <div className="main-ethos-section">
            <h2>The Victorian Model of Education is broken. We create Blended, Accelerated, Virtual Learning Environments to support Teachers, Tutors, Parents, and Students. Wherever you learn, we provide the most accessible, affordable, quality controlled online educational support available.</h2>
          </div>

          {/* Begin Journey Section */}
          <div className="journey-section">
            <h3>Begin your teaching and learning journey with <strong>Guerilla Teacher's</strong> support</h3>
          </div>

          {/* Our Ethos: Learn Without Limits */}
          <div className="learn-without-limits">
            <h2>Our Ethos: Learn Without Limits</h2>
            <p>
              Learning should meet the individual needs of each child. Children are entering a rapidly changing world and the knowledge they acquire today is different from the skills they will need when they leave school – therefore they must be inspired to become life-long learners. So learning how to learn, to be creative, experiment, communicate, disseminate, take responsibility, work together, exchange and respectfully discuss opinions are some of the competences we seek to develop.
            </p>
            <div className="contact-cta">
              <p>Have questions? <Link to="/can-we-help" className="contact-link">Get in touch</Link></p>
            </div>
          </div>

          {/* Examination Preparation Service */}
          <div className="exam-prep-section">
            <div className="exam-prep-content">
              <div className="exam-prep-icon">
                <a 
                  href="https://www.youtube.com/watch?v=IdWWMB2MTn0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="youtube-icon"
                  title="Watch our eLearning Guide video"
                >
                </a>
              </div>
              <div className="exam-prep-text">
                <h3>Examination Preparation Service</h3>
                <h2>Upgrade Your Exam Skills Prepare for Success</h2>
                <p>
                  Opening up opportunities to succeed in the IGCSE and AS Examinations. Guerilla Teaching offers to accompany learners at every stage of their learning, and provide targeted examination skills for their individual success.
                </p>
                <Link to="/start-here/elearning" className="view-guide-btn">
                  View our eLearning Guide
                </Link>
              </div>
            </div>
          </div>

          {/* Why Guerilla Teaching is Successful */}
          <div className="success-section">
            <h3>why is Guerilla Teaching so successful?</h3>
            <h2>Hear from our clients and our learners' Parents</h2>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <h4>Curriculum Design</h4>
                <p>Guerilla Teaching provided the most intuitive and user friendly interface for our VLE - a real industry leader!</p>
                <div className="testimonial-author">
                  <strong>Landi Colleges</strong>
                  <span>Director</span>
                </div>
              </div>

              <div className="testimonial-card">
                <h4>"Even when you don't succeed never give up and you'll strive to be the best you can be"</h4>
                <p>I really love the courses because it allows me to not only learn at my own pace, but gives me the one on one experience that I think every student needs. The online platform really is an amazing way to learn.</p>
                <div className="testimonial-author">
                  <strong>Victoria Lock</strong>
                  <span>AS Level Student</span>
                </div>
              </div>

              <div className="testimonial-card">
                <h4>Highly recommend their courses and teaching system</h4>
                <p>I am happy with their arrangement of lessons and subjects. They reflect a scientific investigation into effective methods to adopt.</p>
                <div className="testimonial-author">
                  <strong>Kelly</strong>
                  <span>Zion's mom, South Africa</span>
                </div>
              </div>

              <div className="testimonial-card">
                <h4>Ticks our boxes</h4>
                <p>Yes a very smooth, well run online platform. We feel like it ticks all our boxes.</p>
                <div className="testimonial-author">
                  <strong>Lori</strong>
                  <span>Mum of IMYP1 Student</span>
                </div>
              </div>

              <div className="testimonial-card">
                <h4>Does not require us to travel</h4>
                <p>We live far from the madding crowd and love the fact that a quality education, which is accepted world wide, does not require us to travel ridiculous mileage every day or send our son to boarding school.</p>
                <div className="testimonial-author">
                  <strong>Kelly</strong>
                  <span>Zion's Mom, South Africa</span>
                </div>
              </div>

              <div className="testimonial-card">
                <h4>Prompt response to any query</h4>
                <p>I most appreciate the prompt response to any query and the weekly feedback and progress report.</p>
                <div className="testimonial-author">
                  <strong>Colleen Granger</strong>
                  <span>Mozambique</span>
                </div>
              </div>

              <div className="testimonial-card">
                <h4>Happy with Academic Structure</h4>
                <p>I am extremely happy with the academic structure, support and engagement provided!!</p>
                <div className="testimonial-author">
                  <strong>Tracey Berry</strong>
                  <span>Cayleigh Berry's Mom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start Learning Journey */}
          <div className="start-learning-section">
            <h3>Start your LEARNING journey today!</h3>
            <h2>Let us help you succeed!</h2>
            <Link to="/start-here" className="get-started-btn">
              Get started now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurEthos;