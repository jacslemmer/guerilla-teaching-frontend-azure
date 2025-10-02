import React, { useState } from 'react';
import './CanWeHelp.css';
import PageHeader from '../components/PageHeader';

const CanWeHelp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - in real app, send to backend
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="can-we-help">
        <PageHeader 
          title="Can We Help?" 
          subtitle="We'd love to help you. Please provide your contact details and what you need help with so that we can reach out to you." 
        />
        
        <div className="content-section">
          <div className="container">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Thank You!</h2>
              <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
              <button className="btn btn-primary" onClick={resetForm}>
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="can-we-help">
      <PageHeader 
        title="Can We Help?" 
        subtitle="We'd love to help you. Please provide your contact details and what you need help with so that we can reach out to you." 
      />
      
      <div className="content-section">
        <div className="container">
          <div className="contact-form-container">
            <form className="professional-contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your message (optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about how we can help you..."
                  rows={6}
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit'}
              </button>
            </form>

            <div className="contact-info">
              <h3>Other Ways to Reach Us</h3>
              <div className="contact-methods">
                <div className="contact-method">
                  <span className="contact-icon">📧</span>
                  <div>
                    <strong>Email</strong>
                    <p>info@guerillateaching.africa</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon">📞</span>
                  <div>
                    <strong>Phone</strong>
                    <p>+27 123 456 789</p>
                  </div>
                </div>
                <div className="contact-method">
                  <span className="contact-icon">🕒</span>
                  <div>
                    <strong>Hours</strong>
                    <p>Mon-Fri: 8AM-6PM<br />Sat: 9AM-2PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanWeHelp;
