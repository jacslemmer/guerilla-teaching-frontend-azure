import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing2025.css';
import { CartItem, Product } from '@guerilla-teaching/shared-types';
import PageHeader from '../components/PageHeader';

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

// Import all AS Level course images
import ASBiology from '../assets/AS Biology.jpeg';
import ASBusiness from '../assets/AS Business.jpeg';
import ASChemistry from '../assets/AS Chemistry.jpeg';
import ASEnglish from '../assets/AS English.jpeg';
import ASGeographyPearson from '../assets/AS Geography Pearson.jpeg';
import ASGeographyCambridge from '../assets/AS Geography.jpeg';
import ASEnvironmentManagement from '../assets/AS Environment Management.jpeg';
import ASMath from '../assets/AS Math.jpeg';
import ASPhysics from '../assets/AS Physics.jpeg';
import ASReligiousStudies from '../assets/AS Relgious Studies.png';

interface PricingTier {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  category: 'IGCSE' | 'AS Level';
  type: 'Standard' | 'Premium';
  subjects: number;
}

// Using shared CartItem type from @guerilla-teaching/shared-types

const Pricing2025: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'IGCSE' | 'AS Level'>('IGCSE');
  const [selectedContentType, setSelectedContentType] = useState<'programs' | 'courses' | 'tutoring'>('programs');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [quote, setQuote] = useState<CartItem[]>(() => {
    const savedQuote = localStorage.getItem('quoteRequest');
    return savedQuote ? JSON.parse(savedQuote) : [];
  });
  const [showAdded, setShowAdded] = useState<string | null>(null);
  const navigate = useNavigate();


  const pricingTiers: PricingTier[] = [
    // IGCSE Offerings
    {
      id: 'igcse-standard-1',
      title: 'Standard Service: 1 IGCSE Subject',
      price: 'R350/month',
      description: 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Self-study at your own pace'
      ],
      category: 'IGCSE',
      type: 'Standard',
      subjects: 1
    },
    {
      id: 'igcse-standard-bundle',
      title: 'Standard Service IGCSE Bundle',
      price: 'R1200/month',
      description: 'Choose any SIX subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Six subjects included',
        'Self-study at your own pace'
      ],
      category: 'IGCSE',
      type: 'Standard',
      subjects: 6
    },
    {
      id: 'igcse-premium-1',
      title: 'Premium Service: 1 IGCSE Subject',
      price: 'R650/month',
      description: 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging'
      ],
      category: 'IGCSE',
      type: 'Premium',
      subjects: 1
    },
    {
      id: 'igcse-premium-bundle',
      title: 'Premium Service IGCSE Bundle',
      price: 'R2999/month',
      description: 'Choose any SIX subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging',
        'Six subjects included'
      ],
      category: 'IGCSE',
      type: 'Premium',
      subjects: 6
    },
    // AS Level Offerings
    {
      id: 'as-standard-1',
      title: 'Standard Service IAS Level Subject',
      price: 'R350/month',
      description: 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Self-study at your own pace'
      ],
      category: 'AS Level',
      type: 'Standard',
      subjects: 1
    },
    {
      id: 'as-standard-bundle',
      title: 'Standard Service IAS Bundle',
      price: 'R1200/month',
      description: 'Choose any FOUR subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.',
      features: [
        'Access to all course material',
        'Computer assessed material',
        'Memos for self assessment',
        'Four subjects included',
        'Self-study at your own pace'
      ],
      category: 'AS Level',
      type: 'Standard',
      subjects: 4
    },
    {
      id: 'as-premium-1',
      title: 'Premium Service: 1 IAS Subject',
      price: 'R650/month',
      description: 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging'
      ],
      category: 'AS Level',
      type: 'Premium',
      subjects: 1
    },
    {
      id: 'as-premium-bundle',
      title: 'Premium Service: IAS Bundle',
      price: 'R2500/month',
      description: 'Choose any FOUR subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.',
      features: [
        'Everything from Standard Service',
        'Expert assessment and feedback',
        'Mock examinations',
        'Progress tracking',
        'Personalised support via messaging',
        'Four subjects included'
      ],
      category: 'AS Level',
      type: 'Premium',
      subjects: 4
    }
  ];

  const filteredTiers = pricingTiers.filter(tier =>
    tier.category === selectedCategory
  );

  const handlePricingClick = (tierId: string) => {
    setShowDetails(showDetails === tierId ? null : tierId);
  };

  // Add to Quote logic (updated for quote system)
  const addToQuote = (tier: PricingTier) => {
    const priceValue = parseFloat(tier.price.replace(/[^\d.]/g, ''));
    const product: Product = {
      id: `pricing-${tier.id}`,
      name: tier.title,
      description: tier.description,
      price: priceValue,
      image: '/images/logo.png', // Placeholder or use a relevant image
      category: 'Pricing 2025',
      inStock: true,
      featured: false,
      tags: [tier.category, tier.type, 'Monthly Subscription']
    };
    setQuote(prevQuote => {
      const existingItem = prevQuote.find(item => item.product.id === product.id);
      let newQuote;
      if (existingItem) {
        newQuote = prevQuote.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newQuote = [...prevQuote, { product, quantity: 1 }];
      }
      localStorage.setItem('quoteRequest', JSON.stringify(newQuote));
      return newQuote;
    });
    setShowAdded(tier.id);
    setTimeout(() => setShowAdded(null), 1500);
  };

  // Add Course to Quote
  const addCourseToQuote = (courseName: string, coursePrice: string, courseType: string) => {
    const priceValue = parseFloat(coursePrice.replace(/[^\d.]/g, ''));
    const product: Product = {
      id: `course-${courseName.toLowerCase().replace(/\s+/g, '-')}`,
      name: courseName,
      description: `${courseType} Course`,
      price: priceValue,
      image: '/images/logo.png',
      category: 'Individual Courses',
      inStock: true,
      featured: false,
      tags: [courseType, 'Course']
    };
    setQuote(prevQuote => {
      const existingItem = prevQuote.find(item => item.product.id === product.id);
      let newQuote;
      if (existingItem) {
        newQuote = prevQuote.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newQuote = [...prevQuote, { product, quantity: 1 }];
      }
      localStorage.setItem('quoteRequest', JSON.stringify(newQuote));
      return newQuote;
    });
    setShowAdded(product.id);
    setTimeout(() => setShowAdded(null), 1500);
  };

  // Add Tutoring to Quote
  const addTutoringToQuote = (serviceName: string, servicePrice: string) => {
    const priceValue = parseFloat(servicePrice.replace(/[^\d.]/g, ''));
    const product: Product = {
      id: `tutoring-${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
      name: serviceName,
      description: 'Personal Tutoring Service',
      price: priceValue,
      image: '/images/logo.png',
      category: 'Personal Tutoring Services',
      inStock: true,
      featured: false,
      tags: ['Tutoring', 'Hourly Service']
    };
    setQuote(prevQuote => {
      const existingItem = prevQuote.find(item => item.product.id === product.id);
      let newQuote;
      if (existingItem) {
        newQuote = prevQuote.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newQuote = [...prevQuote, { product, quantity: 1 }];
      }
      localStorage.setItem('quoteRequest', JSON.stringify(newQuote));
      return newQuote;
    });
    setShowAdded(product.id);
    setTimeout(() => setShowAdded(null), 1500);
  };

  // Quote summary helpers
  const getQuoteItemCount = () => quote.reduce((total, item) => total + item.quantity, 0);
  const getQuoteTotal = () => quote.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className="pricing-2025">
      <PageHeader 
        title="Shop" 
        subtitle="Choose the perfect plan for your educational journey" 
      />
      
      <div className="content-section" id="all-products">
        <div className="container">
          {/* Quote Summary and View Quote */}
          <div className="quote-summary-bar">
            <div className="quote-summary-info">
              <span className="quote-icon">📋</span>
              <span className="quote-count">{getQuoteItemCount()} item{getQuoteItemCount() !== 1 ? 's' : ''}</span>
              <span className="quote-total">Total: R {getQuoteTotal().toFixed(2)}</span>
            </div>
            <button className="view-quote-btn" onClick={() => navigate('/quote-cart')}>
              View Quote
            </button>
          </div>

          {/* Content Type Navigation */}
          <div className="content-type-navigation">
            <div className="content-type-tabs">
              <button
                className={`content-type-tab ${selectedContentType === 'programs' ? 'active' : ''}`}
                onClick={() => setSelectedContentType('programs')}
              >
                📚 Programs
              </button>
              <button
                className={`content-type-tab ${selectedContentType === 'courses' ? 'active' : ''}`}
                onClick={() => setSelectedContentType('courses')}
              >
                📖 Individual Courses
              </button>
              <button
                className={`content-type-tab ${selectedContentType === 'tutoring' ? 'active' : ''}`}
                onClick={() => setSelectedContentType('tutoring')}
              >
                👨‍🏫 Personal Tutoring
              </button>
            </div>
          </div>

          <div className="pricing-header">
            <h2>
              {selectedContentType === 'programs' && 'International GCSE & AS Level Programs 2025'}
              {selectedContentType === 'courses' && 'Individual Courses'}
              {selectedContentType === 'tutoring' && 'Personal Tutoring Services'}
            </h2>
            <p>
              {selectedContentType === 'programs' && 'Flexible program packages designed to meet your learning needs and budget'}
              {selectedContentType === 'courses' && 'Choose individual courses to customize your learning experience'}
              {selectedContentType === 'tutoring' && 'One-on-one expert tutoring for personalized learning support'}
            </p>
          </div>
          
          {/* Content sections that swap based on selectedContentType */}
          {selectedContentType === 'programs' && (
            <>
              <div className="category-tabs">
                <button
                  className={`category-tab ${selectedCategory === 'IGCSE' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('IGCSE')}
                >
                  International GCSE
                </button>
                <button
                  className={`category-tab ${selectedCategory === 'AS Level' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('AS Level')}
                >
                  International AS Level
                </button>
              </div>

              {selectedCategory === 'IGCSE' && (
            <>
              <div id="igcse-programs"></div>
              <h2 className="section-title">International GCSE Programs</h2>
              <div className="pricing-grid">
                {filteredTiers
                  .filter(tier => tier.category === 'IGCSE')
                  .sort((a, b) => {
                    // Sort order: standard single, standard bundle, premium single, premium bundle
                    if (a.type === 'Standard' && b.type === 'Premium') return -1;
                    if (a.type === 'Premium' && b.type === 'Standard') return 1;
                    if (a.type === b.type) {
                      if (a.subjects === 1 && b.subjects > 1) return -1;
                      if (a.subjects > 1 && b.subjects === 1) return 1;
                    }
                    return 0;
                  })
                  .map((tier) => (
                    <div
                      key={tier.id}
                      className={`pricing-card ${showDetails === tier.id ? 'expanded' : ''}`}
                      onClick={() => handlePricingClick(tier.id)}
                    >
                      <div className="pricing-header">
                        <div className="tier-category">{tier.category}</div>
                        <div className="tier-type">{tier.type}</div>
                        <h3>{tier.title}</h3>
                        <div className="price">{tier.price}</div>
                        <div className="subjects-count">{tier.subjects} {tier.subjects === 1 ? 'Subject' : 'Subjects'}</div>
                      </div>
                      <div className="pricing-description">
                        <p>{tier.description}</p>
                      </div>
                      <div className="pricing-features">
                        <h4>What's Included:</h4>
                        <ul>
                          {tier.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pricing-actions">
                        <button className="learn-more-btn">
                          {showDetails === tier.id ? 'Show Less' : 'Learn More'}
                        </button>
                        <button
                          className="enroll-btn add-to-quote-btn"
                          onClick={e => {
                            e.stopPropagation();
                            addToQuote(tier);
                          }}
                        >
                          {showAdded === tier.id ? 'Added!' : 'Add to Quote'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {selectedCategory === 'AS Level' && (
            <>
              <div id="as-programs"></div>
              <h2 className="section-title">International AS Level Programs</h2>
              <div className="pricing-grid">
                {filteredTiers
                  .filter(tier => tier.category === 'AS Level')
                  .sort((a, b) => {
                    // Sort order: standard single, standard bundle, premium single, premium bundle
                    if (a.type === 'Standard' && b.type === 'Premium') return -1;
                    if (a.type === 'Premium' && b.type === 'Standard') return 1;
                    if (a.type === b.type) {
                      if (a.subjects === 1 && b.subjects > 1) return -1;
                      if (a.subjects > 1 && b.subjects === 1) return 1;
                    }
                    return 0;
                  })
                  .map((tier) => (
                    <div
                      key={tier.id}
                      className={`pricing-card ${showDetails === tier.id ? 'expanded' : ''}`}
                      onClick={() => handlePricingClick(tier.id)}
                    >
                      <div className="pricing-header">
                        <div className="tier-category">{tier.category}</div>
                        <div className="tier-type">{tier.type}</div>
                        <h3>{tier.title}</h3>
                        <div className="price">{tier.price}</div>
                        <div className="subjects-count">{tier.subjects} {tier.subjects === 1 ? 'Subject' : 'Subjects'}</div>
                      </div>
                      <div className="pricing-description">
                        <p>{tier.description}</p>
                      </div>
                      <div className="pricing-features">
                        <h4>What's Included:</h4>
                        <ul>
                          {tier.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pricing-actions">
                        <button className="learn-more-btn">
                          {showDetails === tier.id ? 'Show Less' : 'Learn More'}
                        </button>
                        <button
                          className="enroll-btn add-to-quote-btn"
                          onClick={e => {
                            e.stopPropagation();
                            addToQuote(tier);
                          }}
                        >
                          {showAdded === tier.id ? 'Added!' : 'Add to Quote'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
            </>
          )}

          {selectedContentType === 'courses' && (
            <div className="courses-section">
              <h2 className="section-title">Individual Courses</h2>
            
            {/* Course Navigation */}
            <div className="course-navigation">
              <button className="course-nav-btn current" disabled>
                IGCSE
              </button>
              <a href="#as-courses" className="course-nav-btn">
                Skip to AS Level
              </a>
            </div>
            
            <div className="course-category" id="igcse-courses">
              <h3>IGCSE Courses (11 Available)</h3>
              <div className="courses-grid">
                <div className="course-card">
                  <img src={GCSEMath} alt="IGCSE Mathematics" className="course-image" />
                  <h4>Mathematics</h4>
                  <p>Comprehensive mathematics covering algebra, geometry, statistics, and number. Essential foundation for A-Level sciences and university entry.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Mathematics', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-mathematics' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEBiology} alt="IGCSE Biology" className="course-image" />
                  <h4>Biology</h4>
                  <p>Comprehensive life sciences covering cells, genetics, ecology, human biology. Gateway to medical and biological sciences.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Biology', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-biology' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEChemistry} alt="IGCSE Chemistry" className="course-image" />
                  <h4>Chemistry</h4>
                  <p>Study atomic structure, bonding, acids and bases, organic chemistry. Essential for medical and science careers.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Chemistry', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-chemistry' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEPhysics} alt="IGCSE Physics" className="course-image" />
                  <h4>Physics</h4>
                  <p>Explore mechanics, electricity, waves, atomic physics and more. Perfect preparation for A-Level Physics and engineering degrees.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Physics', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-physics' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEEnglish} alt="IGCSE English" className="course-image" />
                  <h4>English Language</h4>
                  <p>Develop critical reading, creative writing, and communication skills essential for all academic and professional paths.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE English Language', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-english-language' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEAfrikaans} alt="IGCSE Afrikaans" className="course-image" />
                  <h4>Afrikaans (Second Language)</h4>
                  <p>Develop proficiency in Afrikaans for South African students seeking bilingual qualifications.</p>
                  <div className="course-details">
                    <span className="exam-board">Cambridge</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Afrikaans', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-afrikaans' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEHistory} alt="IGCSE History" className="course-image" />
                  <h4>History</h4>
                  <p>Study key historical periods and develop analytical skills through primary source analysis and essay writing.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE History', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-history' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEGeography} alt="IGCSE Geography" className="course-image" />
                  <h4>Geography</h4>
                  <p>Explore physical and human geography, environmental issues, and develop fieldwork skills for modern challenges.</p>
                  <div className="course-details">
                    <span className="exam-board">Cambridge</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Geography', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-geography' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEBusiness} alt="IGCSE Business" className="course-image" />
                  <h4>Business Studies</h4>
                  <p>Learn business fundamentals, entrepreneurship, and economic principles. Perfect foundation for business careers.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Business Studies', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-business-studies' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEEnvironmentalManagement} alt="IGCSE Environmental Management" className="course-image" />
                  <h4>Environmental Management</h4>
                  <p>Study sustainability, conservation, and environmental science for the challenges of climate change.</p>
                  <div className="course-details">
                    <span className="exam-board">Cambridge</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Environmental Management', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-environmental-management' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={GCSEReligiousStudies} alt="IGCSE Religious Studies" className="course-image" />
                  <h4>Religious Studies</h4>
                  <p>Explore world religions, ethics, and philosophy to develop critical thinking about moral and spiritual questions.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">2 years</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('IGCSE Religious Studies', 'R350', 'IGCSE')}
                  >
                    {showAdded === 'course-igcse-religious-studies' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
              </div>
            </div>

            <div className="course-category" id="as-courses">
              <h3>AS Level Courses (10 Available)</h3>
              <div className="courses-grid">
                <div className="course-card">
                  <img src={ASBiology} alt="AS Biology" className="course-image" />
                  <h4>AS Biology</h4>
                  <p>Advanced biological concepts, practical skills, and scientific analysis for university preparation.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Biology', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-biology' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASBusiness} alt="AS Business" className="course-image" />
                  <h4>AS Business</h4>
                  <p>Advanced business concepts, strategy, and management principles for future business leaders.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Business', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-business' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASChemistry} alt="AS Chemistry" className="course-image" />
                  <h4>AS Chemistry</h4>
                  <p>Advanced chemical principles, organic chemistry, and laboratory techniques for science careers.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Chemistry', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-chemistry' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASEnglish} alt="AS English" className="course-image" />
                  <h4>AS English Language</h4>
                  <p>Advanced English language skills, critical analysis, and communication for university study.</p>
                  <div className="course-details">
                    <span className="exam-board">Cambridge</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS English', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-english' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASGeographyPearson} alt="AS Geography Pearson" className="course-image" />
                  <h4>AS Geography (Pearson)</h4>
                  <p>Advanced geographical concepts, fieldwork, and data analysis with Pearson curriculum.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Geography Pearson', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-geography-pearson' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASGeographyCambridge} alt="AS Geography Cambridge" className="course-image" />
                  <h4>AS Geography (Cambridge)</h4>
                  <p>Advanced geographical concepts, fieldwork, and data analysis with Cambridge curriculum.</p>
                  <div className="course-details">
                    <span className="exam-board">Cambridge</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Geography Cambridge', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-geography-cambridge' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASEnvironmentManagement} alt="AS Environmental Management" className="course-image" />
                  <h4>AS Environmental Management</h4>
                  <p>Environmental systems, sustainability, and conservation strategies for environmental careers.</p>
                  <div className="course-details">
                    <span className="exam-board">Cambridge</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Environmental Management', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-environmental-management' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASMath} alt="AS Mathematics" className="course-image" />
                  <h4>AS Mathematics</h4>
                  <p>Pure mathematics, statistics, and mechanics at advanced level for STEM university programs.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Mathematics', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-mathematics' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASPhysics} alt="AS Physics" className="course-image" />
                  <h4>AS Physics</h4>
                  <p>Advanced mechanics, quantum physics, and experimental methods for engineering and physics degrees.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Physics', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-physics' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
                <div className="course-card">
                  <img src={ASReligiousStudies} alt="AS Religious Studies" className="course-image" />
                  <h4>AS Religious Studies</h4>
                  <p>Advanced study of world religions, ethics, and philosophy for humanities and theology programs.</p>
                  <div className="course-details">
                    <span className="exam-board">Pearson</span>
                    <span className="duration">1 year</span>
                  </div>
                  <div className="course-price">R350</div>
                  <button 
                    className="add-course-btn"
                    onClick={() => addCourseToQuote('AS Religious Studies', 'R350', 'AS Level')}
                  >
                    {showAdded === 'course-as-religious-studies' ? 'Added!' : 'Add to Quote'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {selectedContentType === 'tutoring' && (
            <div className="tutoring-section">
              <h2 className="section-title">Personal Tutoring Services</h2>
              <p>One-on-one expert tutoring for personalized learning support</p>

            {/* Top Pricing Disclaimer */}
            <div className="pricing-disclaimer prominent">
              <p><strong>*PRICING DISCLAIMER:</strong> The R600/hour rate shown below is indicative only. Actual tutoring rates may vary based on tutor experience, qualifications, and subject complexity.</p>
            </div>
            
            <div className="tutoring-grid">
              <div className="tutoring-card">
                <h4>IGCSE Subject Tutoring</h4>
                <p>Individual tutoring for any IGCSE subject with qualified teachers</p>
                <div className="tutoring-price">R600/hour</div>
                <button 
                  className="add-course-btn"
                  onClick={() => addTutoringToQuote('IGCSE Subject Tutoring', 'R600/hour')}
                >
                  {showAdded === 'tutoring-igcse-subject-tutoring' ? 'Added!' : 'Add to Quote'}
                </button>
              </div>
              <div className="tutoring-card">
                <h4>AS Level Subject Tutoring</h4>
                <p>Advanced level tutoring for university preparation</p>
                <div className="tutoring-price">R600/hour</div>
                <button 
                  className="add-course-btn"
                  onClick={() => addTutoringToQuote('AS Level Subject Tutoring', 'R600/hour')}
                >
                  {showAdded === 'tutoring-as-level-subject-tutoring' ? 'Added!' : 'Add to Quote'}
                </button>
              </div>
              <div className="tutoring-card">
                <h4>Exam Preparation</h4>
                <p>Intensive exam preparation and practice sessions</p>
                <div className="tutoring-price">R600/hour</div>
                <button 
                  className="add-course-btn"
                  onClick={() => addTutoringToQuote('Exam Preparation', 'R600/hour')}
                >
                  {showAdded === 'tutoring-exam-preparation' ? 'Added!' : 'Add to Quote'}
                </button>
              </div>
              <div className="tutoring-card">
                <h4>Study Skills Coaching</h4>
                <p>Learn effective study techniques and time management</p>
                <div className="tutoring-price">R600/hour</div>
                <button 
                  className="add-course-btn"
                  onClick={() => addTutoringToQuote('Study Skills Coaching', 'R600/hour')}
                >
                  {showAdded === 'tutoring-study-skills-coaching' ? 'Added!' : 'Add to Quote'}
                </button>
              </div>
            </div>

            {/* Pricing Disclaimer */}
            <div className="pricing-disclaimer">
              <p><strong>*Pricing Disclaimer:</strong> The R600/hour rate is indicative only. Actual tutoring rates may vary based on tutor experience, qualifications, and subject complexity.</p>
            </div>
          </div>
        )}

        {/* End of all content type sections */}

          <div className="pricing-footer">
            <div className="contact-section">
              <h3>Need Help Choosing?</h3>
              <p>Our education consultants are here to help you find the perfect plan for your learning goals.</p>
              <button className="contact-btn" onClick={() => navigate('/can-we-help')}>Contact Us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing2025; 