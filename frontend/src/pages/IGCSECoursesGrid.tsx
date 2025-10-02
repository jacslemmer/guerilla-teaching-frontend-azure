import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, Product } from '@guerilla-teaching/shared-types';
import './IGCSECoursesGrid.css';

// Import all IGCSE course images
import GCSEAfrikaans from '../assets/GCSE Afrikaans.jpeg';
import GCSEBiology from '../assets/GCSE Biology.jpeg';
import GCSEBusiness from '../assets/GCSE Business.jpg';
import GCSEEnglish from '../assets/GCSE English.jpeg';
import GCSEChemistry from '../assets/GCSE Chemistry.jpeg';
import GCSEEnvironmentalManagement from '../assets/GCSE Environmental management.jpeg';
import GCSEGeography from '../assets/GCSE Geography Cambridge.jpeg';
import GCSEHistory from '../assets/GCSE History.jpeg';
import GCSEMath from '../assets/GCSE Math.jpg';
import GCSEPhysics from '../assets/GCSE Physics.jpeg';
import GCSEReligiousStudies from '../assets/GCSE Religious Studies.png';

interface IGCSECourse {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  examBoard: 'Pearson' | 'Cambridge';
  duration: string;
  assessment: string;
  category: 'Sciences' | 'Languages' | 'Humanities' | 'Mathematics' | 'Business';
}

const IGCSECoursesGrid: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const courses: IGCSECourse[] = [
    {
      id: 'igcse-mathematics',
      title: 'International GCSE Mathematics',
      shortTitle: 'Mathematics',
      description: 'Comprehensive mathematics covering algebra, geometry, statistics, and number. Essential foundation for A-Level sciences and university entry.',
      image: GCSEMath,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers',
      category: 'Mathematics'
    },
    {
      id: 'igcse-physics',
      title: 'International GCSE Physics',
      shortTitle: 'Physics',
      description: 'Explore mechanics, electricity, waves, atomic physics and more. Perfect preparation for A-Level Physics and engineering degrees.',
      image: GCSEPhysics,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers + practical',
      category: 'Sciences'
    },
    {
      id: 'igcse-chemistry',
      title: 'International GCSE Chemistry',
      shortTitle: 'Chemistry',
      description: 'Study atomic structure, bonding, acids and bases, organic chemistry. Essential for medical and science careers.',
      image: GCSEChemistry,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers + practical',
      category: 'Sciences'
    },
    {
      id: 'igcse-biology',
      title: 'International GCSE Biology',
      shortTitle: 'Biology',
      description: 'Comprehensive life sciences covering cells, genetics, ecology, human biology. Gateway to medical and biological sciences.',
      image: GCSEBiology,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers + practical',
      category: 'Sciences'
    },
    {
      id: 'igcse-english',
      title: 'International GCSE English Language',
      shortTitle: 'English',
      description: 'Develop critical reading, creative writing, and communication skills essential for all academic and professional paths.',
      image: GCSEEnglish,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Reading and writing papers',
      category: 'Languages'
    },
    {
      id: 'igcse-afrikaans',
      title: 'International GCSE Afrikaans (Second Language)',
      shortTitle: 'Afrikaans',
      description: 'Develop proficiency in Afrikaans for South African students seeking bilingual qualifications.',
      image: GCSEAfrikaans,
      examBoard: 'Cambridge',
      duration: '2 years',
      assessment: 'Reading, writing, listening, speaking',
      category: 'Languages'
    },
    {
      id: 'igcse-history',
      title: 'International GCSE History',
      shortTitle: 'History',
      description: 'Study key historical periods and develop analytical skills through primary source analysis and essay writing.',
      image: GCSEHistory,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers',
      category: 'Humanities'
    },
    {
      id: 'igcse-geography',
      title: 'International GCSE Geography',
      shortTitle: 'Geography',
      description: 'Explore physical and human geography, environmental issues, and develop fieldwork skills for modern challenges.',
      image: GCSEGeography,
      examBoard: 'Cambridge',
      duration: '2 years',
      assessment: 'Written papers + coursework',
      category: 'Humanities'
    },
    {
      id: 'igcse-business',
      title: 'International GCSE Business Studies',
      shortTitle: 'Business',
      description: 'Learn business fundamentals, entrepreneurship, and economic principles. Perfect foundation for business careers.',
      image: GCSEBusiness,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers',
      category: 'Business'
    },
    {
      id: 'igcse-environmental-management',
      title: 'International GCSE Environmental Management',
      shortTitle: 'Environmental Management',
      description: 'Study sustainability, conservation, and environmental science for the challenges of climate change.',
      image: GCSEEnvironmentalManagement,
      examBoard: 'Cambridge',
      duration: '2 years',
      assessment: 'Written papers + coursework',
      category: 'Sciences'
    },
    {
      id: 'igcse-religious-studies',
      title: 'International GCSE Religious Studies',
      shortTitle: 'Religious Studies',
      description: 'Explore world religions, ethics, and philosophy to develop critical thinking about moral and spiritual questions.',
      image: GCSEReligiousStudies,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers',
      category: 'Humanities'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Courses', count: courses.length },
    { id: 'Mathematics', name: 'Mathematics', count: courses.filter(c => c.category === 'Mathematics').length },
    { id: 'Sciences', name: 'Sciences', count: courses.filter(c => c.category === 'Sciences').length },
    { id: 'Languages', name: 'Languages', count: courses.filter(c => c.category === 'Languages').length },
    { id: 'Humanities', name: 'Humanities', count: courses.filter(c => c.category === 'Humanities').length },
    { id: 'Business', name: 'Business', count: courses.filter(c => c.category === 'Business').length }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const addCourseToQuote = (course: IGCSECourse) => {
    // Convert course to Product format for quote system
    const product: Product = {
      id: course.id,
      name: course.title,
      description: course.description,
      price: 350, // Monthly subscription price per subject
      image: course.image,
      category: 'IGCSE Course',
      inStock: true,
      featured: false,
      tags: [course.category, course.examBoard, 'IGCSE']
    };

    const existingQuote = localStorage.getItem('quoteRequest');
    let quoteRequest: CartItem[] = existingQuote ? JSON.parse(existingQuote) : [];

    const existingItem = quoteRequest.find(item => item.product.id === product.id);
    
    if (existingItem) {
      quoteRequest = quoteRequest.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      quoteRequest.push({ product, quantity: 1 });
    }

    localStorage.setItem('quoteRequest', JSON.stringify(quoteRequest));
    
    // Navigate to checkout page
    navigate('/quote-cart');
  };

  const getQuoteCount = () => {
    const existingQuote = localStorage.getItem('quoteRequest');
    if (!existingQuote) return 0;
    const quoteRequest: CartItem[] = JSON.parse(existingQuote);
    return quoteRequest.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="igcse-courses-grid">
      <div className="breadcrumb">
        <div className="container">
          <Link to="/learning-portal">← Back to Learning Portal</Link>
          <span> / </span>
          <Link to="/learning-portal/igcse">International GCSE</Link>
          <span> / Courses</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="courses-hero">
        <div className="container">
          <h1>International GCSE Courses</h1>
          <p className="hero-description">
            Choose from our comprehensive range of Pearson Edexcel and Cambridge International GCSE courses. 
            Build a strong foundation for A-Levels and university with globally recognized qualifications.
          </p>
          {getQuoteCount() > 0 && (
            <div className="quote-status">
              <span>🎓 {getQuoteCount()} courses in your quote request</span>
              <button 
                className="view-quote-btn"
                onClick={() => navigate('/quote-cart')}
              >
                View Quote Request
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Course Categories */}
      <section className="course-categories">
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
                <span className="category-count">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="courses-content">
        <div className="container">
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                  <div className="exam-board-badge">
                    {course.examBoard}
                  </div>
                </div>
                
                <div className="course-content">
                  <h3 className="course-title">{course.shortTitle}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-details">
                    <div className="detail-item">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{course.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Assessment:</span>
                      <span className="detail-value">{course.assessment}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{course.category}</span>
                    </div>
                  </div>
                  
                  <div className="course-price">
                    <span className="price-amount">R350</span>
                    <span className="price-period">/month</span>
                  </div>
                  
                  <div className="course-actions">
                    <button 
                      className="add-to-quote-btn"
                      onClick={() => addCourseToQuote(course)}
                    >
                      Add to Quote
                    </button>
                    <Link 
                      to={`/learning-portal/igcse/courses/${course.id}`}
                      className="view-details-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Tiers CTA */}
      <section className="service-tiers-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your IGCSE Journey?</h2>
            <p>
              Choose from our Standard or Premium service tiers, with options for individual subjects 
              or complete bundles. Get expert support and comprehensive materials for success.
            </p>
            <div className="cta-actions">
              <Link to="/learning-portal/igcse" className="cta-btn primary">
                View Service Tiers
              </Link>
              {getQuoteCount() > 0 && (
                <button 
                  className="cta-btn secondary"
                  onClick={() => navigate('/quote-cart')}
                >
                  Continue to Quote ({getQuoteCount()} courses)
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IGCSECoursesGrid;








