import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, Product } from '@guerilla-teaching/shared-types';
import BookshelfStudent from '../assets/Bookshelf-and-student.jpg';
import PearsonEdexcelLogo from '../assets/pearsonedexcellogo.jpg';
import './InternationalGCSE.css';

const InternationalGCSE: React.FC = () => {
  const navigate = useNavigate();
  const [, setQuote] = useState<CartItem[]>([]);

  // Service tier products matching backend API data
  const serviceTiers: { [key: string]: Product } = {
    'pricing-igcse-standard-1': {
      id: 'pricing-igcse-standard-1',
      name: 'Standard Service: 1 IGCSE Subject',
      description: 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      price: 350,
      image: '/images/pricing/igcse-standard.jpg',
      category: 'IGCSE Service',
      inStock: true,
      featured: false,
      tags: ['IGCSE', 'Standard', 'Self Study', 'Monthly']
    },
    'pricing-igcse-standard-bundle': {
      id: 'pricing-igcse-standard-bundle',
      name: 'Standard Service IGCSE Bundle',
      description: 'Choose any SIX subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. Six subjects included for comprehensive IGCSE preparation.',
      price: 1200,
      image: '/images/pricing/igcse-standard-bundle.jpg',
      category: 'IGCSE Service',
      inStock: true,
      featured: true,
      tags: ['IGCSE', 'Standard', 'Bundle', 'Six Subjects', 'Monthly']
    },
    'pricing-igcse-premium-1': {
      id: 'pricing-igcse-premium-1',
      name: 'Premium Service: 1 IGCSE Subject',
      description: 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      price: 650,
      image: '/images/pricing/igcse-premium.jpg',
      category: 'IGCSE Service',
      inStock: true,
      featured: true,
      tags: ['IGCSE', 'Premium', 'Expert Assessment', 'Mock Exams', 'Monthly']
    },
    'pricing-igcse-premium-bundle': {
      id: 'pricing-igcse-premium-bundle',
      name: 'Premium Service IGCSE Bundle',
      description: 'Choose any SIX subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support. Six subjects included.',
      price: 2999,
      image: '/images/pricing/igcse-premium-bundle.jpg',
      category: 'IGCSE Service',
      inStock: true,
      featured: true,
      tags: ['IGCSE', 'Premium', 'Bundle', 'Six Subjects', 'Expert Support', 'Monthly']
    }
  };

  const addServiceToQuote = (serviceId: string) => {
    const service = serviceTiers[serviceId];
    if (!service) return;

    const existingQuote = localStorage.getItem('quoteRequest');
    let quoteRequest: CartItem[] = existingQuote ? JSON.parse(existingQuote) : [];

    const existingItem = quoteRequest.find(item => item.product.id === service.id);
    
    if (existingItem) {
      quoteRequest = quoteRequest.map(item =>
        item.product.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      quoteRequest.push({ product: service, quantity: 1 });
    }

    localStorage.setItem('quoteRequest', JSON.stringify(quoteRequest));
    setQuote([...quoteRequest]);
    
    // Navigate to quote cart page
    navigate('/quote-cart');
  };

  return (
    <div className="international-gcse">
      <div className="breadcrumb">
        <div className="container">
          <Link to="/learning-portal">← Back to Learning Portal</Link>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image-container">
          <img src={BookshelfStudent} alt="Student in library in front of bookshelf" className="hero-image" />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>International GCSE</h1>
              <h2>Welcome to our Virtual Learning Environment for GCSE</h2>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          {/* Introduction */}
          <div className="intro-section">
            <p className="intro-text">
              Guerilla Teaching believes world-class education should be accessible, affordable, and transformative — not tied to expensive bricks-and-mortar institutions. That's why we offer full support for the globally recognised Pearson Edexcel International IGCSE and AS Level qualifications — empowering independent learners, homeschooling families, and cottage schools to achieve their best, on their terms.
            </p>
            <p className="intro-text">
              Our mission is to equip students aged 14–18 with the confidence, clarity, and critical thinking they need to thrive — in exams and beyond. Whether you're aiming for top university entry, building a flexible learning path, or seeking structure with freedom, we're here to guide you every step of the way with expert teaching, premium resources, and a clear roadmap to success.
            </p>
          </div>

          {/* Why Study Pearson IGCSE */}
          <div className="why-study-section">
            <h2>Why Study Pearson IGCSE?</h2>
            <div className="pearson-logo">
              <img src={PearsonEdexcelLogo} alt="Pearson Edexcel Logo" />
            </div>
            <p className="pearson-intro">
              Guerilla teaching supports students and schools who want more than just a qualification — they want clarity, confidence, and control. That's why we specialise in Pearson Edexcel International GCSE Levels: a modern, exam-board-friendly alternative to Cambridge (CAIE), designed to give learners a real advantage.
            </p>
            
            <p className="advantages-intro">Unlike Cambridge, Pearson Edexcel offers:</p>
            <ul className="advantages-list">
              <li>✅ Modular assessment — students can sit individual units in different examination sittings, each counting fully toward the final grade.</li>
              <li>✅ Straightforward mark schemes and clearer command words — ideal for students whose first language may not be English.</li>
              <li>✅ Streamlined, globally recognised specifications that focus on skills and content — no filler, no fluff.</li>
              <li>✅ Access to digital exams (Onscreen Assessment) — a flexible, future-facing option in (select regions only)</li>
              <li>✅ Consistency across IGCSE and A Level — making the transition smoother for students working towards the Edexcel IAS Levels.</li>
            </ul>
            
            <p className="conclusion-text">
              Whether you're a parent, an independent learner, or a cottage school leader, Guerilla Teaching will equip you with everything you need: student friendly, exam-focused materials, and a vision built on academic freedom and excellence.
            </p>
            <p className="conclusion-text">
              Join a movement that puts mastery before pressure — and learning before labels.
            </p>
          </div>

          {/* Qualification */}
          <div className="qualification-section">
            <h2>Qualification:</h2>
            <p>External Assessments take place in twice a year in May / June and October / November in Registered Examination Centers around the World.</p>
          </div>

          {/* Recognition */}
          <div className="recognition-section">
            <h2>Recognition</h2>
            <p>Leading universities and employers worldwide accept Pearson International IGCSE as evidence of academic ability, understanding and critical thinking.</p>
          </div>

          {/* Distance Learning Benefits */}
          <div className="distance-learning-section">
            <h2>Why choose the Distance Learning Option?</h2>
            <ul className="benefits-list">
              <li>Curriculum-aligned preparation for International Examinations</li>
              <li>Blended Learning without the option of campus support where available.</li>
              <li>Self-paced learning, complete your course in your own time</li>
              <li>For external examination centres only</li>
            </ul>
          </div>

          {/* Service Tiers Section */}
          <div className="service-tiers-section">
            <h2>Choose Your IGCSE Service Tier</h2>
            <div className="service-tiers-grid">
              <div className="service-tier">
                <div className="tier-header">
                  <h3>Standard Service</h3>
                  <div className="tier-subtitle">1 IGCSE Subject</div>
                  <div className="tier-price">R350<span>/month</span></div>
                </div>
                <div className="tier-content">
                  <p>Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.</p>
                  <ul className="tier-features">
                    <li>✓ Course material access</li>
                    <li>✓ Computer assessed material</li>
                    <li>✓ Self-assessment memos</li>
                    <li>✓ Self-paced learning</li>
                  </ul>
                  <button 
                    className="tier-quote-btn"
                    onClick={() => addServiceToQuote('pricing-igcse-standard-1')}
                  >
                    Request Quote
                  </button>
                </div>
              </div>

              <div className="service-tier featured-tier">
                <div className="tier-header">
                  <h3>Standard Service Bundle</h3>
                  <div className="tier-subtitle">6 IGCSE Subjects</div>
                  <div className="tier-price">R1200<span>/month</span></div>
                </div>
                <div className="tier-content">
                  <p>Choose any SIX subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. Six subjects included for comprehensive IGCSE preparation.</p>
                  <ul className="tier-features">
                    <li>✓ All Standard Service features</li>
                    <li>✓ Six subjects included</li>
                    <li>✓ Comprehensive coverage</li>
                    <li>✓ Best value option</li>
                  </ul>
                  <button 
                    className="tier-quote-btn featured"
                    onClick={() => addServiceToQuote('pricing-igcse-standard-bundle')}
                  >
                    Request Quote
                  </button>
                </div>
              </div>

              <div className="service-tier">
                <div className="tier-header">
                  <h3>Premium Service</h3>
                  <div className="tier-subtitle">1 IGCSE Subject</div>
                  <div className="tier-price">R650<span>/month</span></div>
                </div>
                <div className="tier-content">
                  <p>Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform's messaging systems.</p>
                  <ul className="tier-features">
                    <li>✓ All Standard Service features</li>
                    <li>✓ Expert assessment & feedback</li>
                    <li>✓ MOCK examinations</li>
                    <li>✓ Progress tracking</li>
                    <li>✓ Personalised support</li>
                  </ul>
                  <button 
                    className="tier-quote-btn"
                    onClick={() => addServiceToQuote('pricing-igcse-premium-1')}
                  >
                    Request Quote
                  </button>
                </div>
              </div>

              <div className="service-tier premium-tier">
                <div className="tier-header">
                  <h3>Premium Service Bundle</h3>
                  <div className="tier-subtitle">6 IGCSE Subjects</div>
                  <div className="tier-price">R2999<span>/month</span></div>
                </div>
                <div className="tier-content">
                  <p>Choose any SIX subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform's messaging systems.</p>
                  <ul className="tier-features">
                    <li>✓ All Premium Service features</li>
                    <li>✓ Six subjects included</li>
                    <li>✓ Complete premium experience</li>
                    <li>✓ Maximum support & guidance</li>
                  </ul>
                  <button 
                    className="tier-quote-btn premium"
                    onClick={() => addServiceToQuote('pricing-igcse-premium-bundle')}
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Link */}
          <div className="courses-link-section">
            <h2>Choose your IGCSE Courses</h2>
            <Link to="/learning-portal/igcse/courses" className="courses-link">
              Browse Available Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternationalGCSE; 