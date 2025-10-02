import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LearningPortal.css';
import VirtualLearning from '../assets/Banners & Images/e-learning2.png';
import VisionIcon from '../assets/Vision ICON.jpg';
import EthosIcon from '../assets/ETHOS ICON.jpg';
import MissionIcon from '../assets/Mission Icon.jpg';
import GCSEStudent from '../assets/GCSE-student.jpg';
import ASStudent from '../assets/AS-Student.jpg';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  image?: string;
}

const LearningPortal: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: "My son is flying with Guerilla teaching, the expert tutoring, combined with their amazing digital content delivery platform, is a perfect combination.",
      name: "Sharon",
      role: "Parent"
    },
    {
      id: 2,
      text: "I really appreciate Guerilla Teaching. After struggling to return to my studies following a disastrous 1st attempt at AS Levels, this has given me the access to experienced examiners who know how to prepare for the exams! IGCSE / AS Level Student: AS Eng: A AS GEOG: B AS EM: B IG: Bio 7 IG Hist: 7",
      name: "Rob",
      role: "IG/AS Student"
    },
    {
      id: 3,
      text: "After only achieving an E in November exams, I needed a new approach. Within 5 months thanks to Guerilla Teaching, my improvement was amazing. I couldn't have done it on my own.",
      name: "Lucien",
      role: "AS Student"
    }
  ];

  const solutionImages = [
    {
      title: "International GCSE",
      description: "Pearson Edexcel International GCSE qualifications - Explore Service Tiers & Courses",
      link: "/learning-portal/igcse",
      image: GCSEStudent
    },
    {
      title: "International AS Levels",
      description: "Pearson Edexcel International AS Level qualifications - Explore Service Tiers & Courses",
      link: "/learning-portal/as-levels",
      image: ASStudent
    }
  ];

  // Testimonial ticker effect
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  // Image ticker effect
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % solutionImages.length);
    }, 4000);

    return () => clearInterval(imageInterval);
  }, [solutionImages.length]);

  return (
    <div className="learning-portal">
      {/* Hero Section - Clean Image Only */}
      <div className="hero-container">
        <img src={VirtualLearning} alt="Virtual Learning Environment" className="hero-image" />
      </div>

      {/* Segment 2: Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-container">
            <h2>Testimonials</h2>
            <div className="testimonials-ticker">
              <div
                className="testimonial-slide"
                style={{ transform: `translateX(-${currentTestimonial * 33.333}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card">
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <div className="testimonial-author">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segment 3: Mission, Ethos, Vision Section */}
      <section className="mission-section">
        <div className="container">
          <div className="established-info">
            <p className="established-year">Established 2016</p>
            <p className="tagline">Education for everyone, Anywhere, anytime</p>
            <p className="slogan">"The Most Effective Online and Blended Learning Environment Available."</p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <img src={VisionIcon} alt="Vision Icon" />
              </div>
              <h3>VISION</h3>
              <p>To provide accessible, affordable, and quality controlled teaching and learning materials to support both educators and learners, whatever their local contexts and needs - to ensure the successful completion of their learning journey.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <img src={EthosIcon} alt="Ethos Icon" />
              </div>
              <h3>ETHOS</h3>
              <p>We are independent and individual, seeking to achieve effective and meaningful teaching and learning. We are not defined by our approaches to learning, we are freed from the incumbent paradigms and rhetoric of the past. The virtual world is our classroom, unfettered and without walls. We are disrupters; no uniforms or bells subdue us, learning is it's own reward, self discipline and self knowledge our path. We apply the logic of the digital age to the classroom. That logic is inexorable: Access to a world of infinite information has changed how we communicate, process information, and think.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <img src={MissionIcon} alt="Mission Icon" />
              </div>
              <h3>MISSION</h3>
              <p>To create a global network of learning communities, supported by expert, centralized quality control and assessment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Segment 4: Solutions */}
      <section className="solutions-section">
        <div className="container">
          <div className="solutions-container">
            <div className="solutions-ticker">
              <div
                className="solution-slide"
                style={{ transform: `translateX(-${currentImage * 50}%)` }}
              >
                {solutionImages.map((solution, index) => (
                  <Link key={index} to={solution.link} className="solution-card">
                    <img src={solution.image} alt={solution.title} className="solution-image" />
                    <div className="solution-content">
                      <h3>{solution.title}</h3>
                      <p>{solution.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningPortal; 