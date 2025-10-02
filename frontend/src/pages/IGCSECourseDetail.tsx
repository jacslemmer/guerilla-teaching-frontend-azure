import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CartItem, Product } from '@guerilla-teaching/shared-types';
import './IGCSECourseDetail.css';

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

interface CourseModule {
  title: string;
  description: string;
  topics: string[];
}

interface CourseDetail {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  fullDescription: string;
  image: string;
  examBoard: 'Pearson' | 'Cambridge';
  duration: string;
  assessment: string;
  category: 'Sciences' | 'Languages' | 'Humanities' | 'Mathematics' | 'Business';
  popular?: boolean;
  prerequisites: string[];
  careerPaths: string[];
  modules: CourseModule[];
  skillsDeveloped: string[];
  assessmentBreakdown: { type: string; weight: string; description: string }[];
  sampleContent: string[];
}

const IGCSECourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'assessment'>('overview');

  const courseDatabase: { [key: string]: CourseDetail } = {
    'igcse-mathematics': {
      id: 'igcse-mathematics',
      title: 'International GCSE Mathematics',
      shortTitle: 'Mathematics',
      description: 'Comprehensive mathematics covering algebra, geometry, statistics, and number. Essential foundation for A-Level sciences and university entry.',
      fullDescription: 'Our International GCSE Mathematics course provides a comprehensive foundation in mathematical concepts essential for further study and practical applications. This course covers algebra, geometry, trigonometry, statistics, and probability, preparing students for A-Level mathematics and sciences.',
      image: GCSEMath,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers',
      category: 'Mathematics',
      popular: true,
      prerequisites: ['Basic arithmetic', 'Foundation algebra'],
      careerPaths: ['Engineering', 'Finance', 'Data Science', 'Architecture', 'Computer Science', 'Economics'],
      skillsDeveloped: ['Problem-solving', 'Logical reasoning', 'Data analysis', 'Critical thinking', 'Precision and accuracy'],
      modules: [
        {
          title: 'Number and Algebra',
          description: 'Master number systems, algebraic manipulation, and equation solving.',
          topics: ['Integers and rational numbers', 'Algebraic expressions', 'Linear equations', 'Quadratic equations', 'Simultaneous equations']
        },
        {
          title: 'Geometry and Trigonometry',
          description: 'Explore shapes, angles, and trigonometric relationships.',
          topics: ['Angle properties', 'Circle theorems', 'Area and volume', 'Trigonometric ratios', 'Pythagoras theorem']
        },
        {
          title: 'Statistics and Probability',
          description: 'Analyze data and understand probability concepts.',
          topics: ['Data collection', 'Charts and graphs', 'Measures of central tendency', 'Probability rules', 'Statistical interpretation']
        }
      ],
      assessmentBreakdown: [
        { type: 'Paper 1', weight: '50%', description: 'Non-calculator paper covering all topics' },
        { type: 'Paper 2', weight: '50%', description: 'Calculator paper with extended questions' }
      ],
      sampleContent: ['Practice with real exam questions', 'Step-by-step video solutions', 'Interactive online exercises', 'Mock exam papers']
    },
    'igcse-physics': {
      id: 'igcse-physics',
      title: 'International GCSE Physics',
      shortTitle: 'Physics',
      description: 'Explore mechanics, electricity, waves, atomic physics and more. Perfect preparation for A-Level Physics and engineering degrees.',
      fullDescription: 'Discover the fundamental principles governing our universe through our comprehensive International GCSE Physics course. From classical mechanics to modern atomic theory, this course provides essential knowledge for students pursuing science and engineering careers.',
      image: GCSEPhysics,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers + practical',
      category: 'Sciences',
      popular: true,
      prerequisites: ['GCSE Mathematics (recommended)', 'Basic scientific understanding'],
      careerPaths: ['Engineering', 'Medicine', 'Research Scientist', 'Technology', 'Aerospace', 'Renewable Energy'],
      skillsDeveloped: ['Scientific method', 'Mathematical modeling', 'Experimental design', 'Data analysis', 'Problem-solving'],
      modules: [
        {
          title: 'Mechanics and Forces',
          description: 'Study motion, forces, and energy in mechanical systems.',
          topics: ['Motion and speed', 'Forces and acceleration', 'Work and energy', 'Momentum', 'Circular motion']
        },
        {
          title: 'Electricity and Magnetism',
          description: 'Explore electrical circuits and electromagnetic phenomena.',
          topics: ['Current and voltage', 'Resistance and Ohms law', 'Electrical power', 'Magnetic fields', 'Electromagnetic induction']
        },
        {
          title: 'Waves and Modern Physics',
          description: 'Understand wave properties and atomic structure.',
          topics: ['Wave properties', 'Sound and light', 'Electromagnetic spectrum', 'Atomic structure', 'Radioactivity']
        }
      ],
      assessmentBreakdown: [
        { type: 'Paper 1', weight: '40%', description: 'Multiple choice and short answer questions' },
        { type: 'Paper 2', weight: '40%', description: 'Extended writing and calculations' },
        { type: 'Practical', weight: '20%', description: 'Laboratory skills assessment' }
      ],
      sampleContent: ['Virtual laboratory simulations', 'Physics equation sheets', 'Practical experiment guides', 'Video demonstrations']
    },
    'igcse-chemistry': {
      id: 'igcse-chemistry',
      title: 'International GCSE Chemistry',
      shortTitle: 'Chemistry',
      description: 'Study atomic structure, bonding, acids and bases, organic chemistry. Essential for medical and science careers.',
      fullDescription: 'Delve into the molecular world with our comprehensive International GCSE Chemistry course. Understand how atoms interact, chemical reactions occur, and molecules form to create the materials around us.',
      image: GCSEChemistry,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers + practical',
      category: 'Sciences',
      popular: true,
      prerequisites: ['GCSE Mathematics (recommended)', 'Basic scientific knowledge'],
      careerPaths: ['Medicine', 'Pharmacy', 'Chemical Engineering', 'Materials Science', 'Environmental Science', 'Forensics'],
      skillsDeveloped: ['Scientific reasoning', 'Laboratory techniques', 'Chemical calculations', 'Safety awareness', 'Analytical thinking'],
      modules: [
        {
          title: 'Atomic Structure and Bonding',
          description: 'Understand atoms, ions, and how they bond together.',
          topics: ['Atomic structure', 'Electronic configuration', 'Ionic bonding', 'Covalent bonding', 'Metallic bonding']
        },
        {
          title: 'Chemical Reactions',
          description: 'Explore different types of chemical reactions and their mechanisms.',
          topics: ['Acids and bases', 'Oxidation and reduction', 'Reaction rates', 'Equilibrium', 'Energetics']
        },
        {
          title: 'Organic Chemistry and Analysis',
          description: 'Study carbon compounds and analytical techniques.',
          topics: ['Hydrocarbons', 'Alcohols and acids', 'Polymers', 'Analytical methods', 'Environmental chemistry']
        }
      ],
      assessmentBreakdown: [
        { type: 'Paper 1', weight: '40%', description: 'Core chemistry concepts and calculations' },
        { type: 'Paper 2', weight: '40%', description: 'Extended topics and applications' },
        { type: 'Practical', weight: '20%', description: 'Laboratory skills and analysis' }
      ],
      sampleContent: ['Interactive molecular models', 'Reaction mechanism animations', 'Virtual chemistry lab', 'Safety protocols guide']
    },
    'igcse-biology': {
      id: 'igcse-biology',
      title: 'International GCSE Biology',
      shortTitle: 'Biology',
      description: 'Comprehensive life sciences covering cells, genetics, ecology, human biology. Gateway to medical and biological sciences.',
      fullDescription: 'Explore the fascinating world of living organisms with our International GCSE Biology course. From microscopic cells to complex ecosystems, understand the principles that govern all life on Earth.',
      image: GCSEBiology,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers + practical',
      category: 'Sciences',
      prerequisites: ['Basic scientific understanding', 'Interest in living organisms'],
      careerPaths: ['Medicine', 'Veterinary Science', 'Marine Biology', 'Genetics', 'Conservation', 'Biomedical Research'],
      skillsDeveloped: ['Scientific observation', 'Data collection', 'Microscopy skills', 'Ethical reasoning', 'Systems thinking'],
      modules: [
        {
          title: 'Cell Biology and Genetics',
          description: 'Study cell structure, function, and inheritance patterns.',
          topics: ['Cell structure', 'Cell division', 'DNA and genes', 'Inheritance', 'Genetic engineering']
        },
        {
          title: 'Human Biology',
          description: 'Explore human body systems and health.',
          topics: ['Digestive system', 'Circulatory system', 'Respiratory system', 'Nervous system', 'Disease and immunity']
        },
        {
          title: 'Ecology and Environment',
          description: 'Understand ecosystems and environmental interactions.',
          topics: ['Food chains and webs', 'Population dynamics', 'Conservation', 'Human impact', 'Biodiversity']
        }
      ],
      assessmentBreakdown: [
        { type: 'Paper 1', weight: '40%', description: 'Core biological concepts' },
        { type: 'Paper 2', weight: '40%', description: 'Extended biological topics' },
        { type: 'Practical', weight: '20%', description: 'Biological techniques and fieldwork' }
      ],
      sampleContent: ['Microscopy image galleries', 'Anatomy interactive models', 'Ecosystem simulations', 'Genetic crosses calculator']
    },
    'igcse-english': {
      id: 'igcse-english',
      title: 'International GCSE English Language',
      shortTitle: 'English',
      description: 'Develop critical reading, creative writing, and communication skills essential for all academic and professional paths.',
      fullDescription: 'Master the English language with our comprehensive International GCSE English Language course. Develop essential communication skills through critical reading, creative writing, and analytical thinking.',
      image: GCSEEnglish,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Reading and writing papers',
      category: 'Languages',
      popular: true,
      prerequisites: ['Good command of basic English', 'Interest in literature and writing'],
      careerPaths: ['Journalism', 'Teaching', 'Law', 'Publishing', 'Marketing', 'Creative Writing'],
      skillsDeveloped: ['Critical reading', 'Creative writing', 'Analytical thinking', 'Communication', 'Research skills'],
      modules: [
        {
          title: 'Reading and Comprehension',
          description: 'Develop advanced reading and analytical skills.',
          topics: ['Text analysis', 'Literary techniques', 'Inference and interpretation', 'Critical evaluation', 'Comparative reading']
        },
        {
          title: 'Creative and Transactional Writing',
          description: 'Master different writing forms and purposes.',
          topics: ['Narrative writing', 'Descriptive writing', 'Persuasive writing', 'Informative writing', 'Technical writing']
        },
        {
          title: 'Language Study',
          description: 'Understand how language works and evolves.',
          topics: ['Grammar and syntax', 'Vocabulary development', 'Language change', 'Register and style', 'Media language']
        }
      ],
      assessmentBreakdown: [
        { type: 'Reading Paper', weight: '50%', description: 'Comprehension and analysis of texts' },
        { type: 'Writing Paper', weight: '50%', description: 'Creative and transactional writing tasks' }
      ],
      sampleContent: ['Model essays and analyses', 'Writing technique guides', 'Literary extracts', 'Language study resources']
    },
    'igcse-business': {
      id: 'igcse-business',
      title: 'International GCSE Business Studies',
      shortTitle: 'Business',
      description: 'Learn business fundamentals, entrepreneurship, and economic principles. Perfect foundation for business careers.',
      fullDescription: 'Understand the world of business with our comprehensive International GCSE Business Studies course. Learn how businesses operate, make decisions, and respond to economic challenges.',
      image: GCSEBusiness,
      examBoard: 'Pearson',
      duration: '2 years',
      assessment: 'Two written papers',
      category: 'Business',
      popular: true,
      prerequisites: ['Basic mathematics', 'Interest in current affairs'],
      careerPaths: ['Business Management', 'Entrepreneurship', 'Marketing', 'Finance', 'Consulting', 'Economics'],
      skillsDeveloped: ['Business analysis', 'Decision making', 'Financial literacy', 'Communication', 'Leadership'],
      modules: [
        {
          title: 'Business Fundamentals',
          description: 'Learn the basics of how businesses operate.',
          topics: ['Business ownership', 'Stakeholders', 'Business objectives', 'Growth and expansion', 'Business planning']
        },
        {
          title: 'Marketing and Sales',
          description: 'Understand how businesses attract and retain customers.',
          topics: ['Market research', 'Marketing mix', 'Advertising and promotion', 'Customer service', 'Sales techniques']
        },
        {
          title: 'Finance and Operations',
          description: 'Explore business finance and operational management.',
          topics: ['Cash flow', 'Profit and loss', 'Break-even analysis', 'Production methods', 'Quality control']
        }
      ],
      assessmentBreakdown: [
        { type: 'Paper 1', weight: '50%', description: 'Core business concepts and calculations' },
        { type: 'Paper 2', weight: '50%', description: 'Business analysis and evaluation' }
      ],
      sampleContent: ['Case study analyses', 'Business plan templates', 'Financial calculation tools', 'Market research guides']
    }
  };

  useEffect(() => {
    if (courseId && courseDatabase[courseId]) {
      setCourse(courseDatabase[courseId]);
    }
  }, [courseId]);

  const addCourseToQuote = () => {
    if (!course) return;

    const product: Product = {
      id: course.id,
      name: course.title,
      description: course.description,
      price: 350,
      image: course.image,
      category: 'IGCSE Course',
      inStock: true,
      featured: course.popular || false,
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
    navigate('/quote-cart');
  };

  if (!course) {
    return (
      <div className="course-detail-error">
        <div className="container">
          <h1>Course Not Found</h1>
          <p>The requested course could not be found.</p>
          <Link to="/learning-portal/igcse/courses" className="back-link">
            ← Back to Course Grid
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="igcse-course-detail">
      <div className="breadcrumb">
        <div className="container">
          <Link to="/learning-portal">Learning Portal</Link>
          <span> / </span>
          <Link to="/learning-portal/igcse">International GCSE</Link>
          <span> / </span>
          <Link to="/learning-portal/igcse/courses">Courses</Link>
          <span> / {course.shortTitle}</span>
        </div>
      </div>

      {/* Course Hero */}
      <section className="course-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="course-meta">
                <span className="exam-board">{course.examBoard}</span>
                <span className="category">{course.category}</span>
                {course.popular && <span className="popular-badge">Popular Choice</span>}
              </div>
              <h1>{course.title}</h1>
              <p className="course-description">{course.fullDescription}</p>
              <div className="course-stats">
                <div className="stat">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{course.duration}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Assessment</span>
                  <span className="stat-value">{course.assessment}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Monthly Fee</span>
                  <span className="stat-value">R350</span>
                </div>
              </div>
              <div className="hero-actions">
                <button className="add-to-quote-btn" onClick={addCourseToQuote}>
                  Add to Quote Request
                </button>
                <Link to="/learning-portal/igcse" className="view-service-tiers">
                  View Service Tiers
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img src={course.image} alt={course.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="course-content">
        <div className="container">
          <div className="content-tabs">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
              onClick={() => setActiveTab('modules')}
            >
              Course Modules
            </button>
            <button 
              className={`tab-btn ${activeTab === 'assessment' ? 'active' : ''}`}
              onClick={() => setActiveTab('assessment')}
            >
              Assessment
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="overview-grid">
                  <div className="overview-section">
                    <h3>Prerequisites</h3>
                    <ul>
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="overview-section">
                    <h3>Skills Developed</h3>
                    <ul>
                      {course.skillsDeveloped.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="overview-section">
                    <h3>Career Paths</h3>
                    <ul>
                      {course.careerPaths.map((career, index) => (
                        <li key={index}>{career}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="overview-section">
                    <h3>Sample Content</h3>
                    <ul>
                      {course.sampleContent.map((content, index) => (
                        <li key={index}>{content}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'modules' && (
              <div className="modules-content">
                {course.modules.map((module, index) => (
                  <div key={index} className="module-card">
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                    <div className="module-topics">
                      <h4>Key Topics:</h4>
                      <ul>
                        {module.topics.map((topic, topicIndex) => (
                          <li key={topicIndex}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assessment' && (
              <div className="assessment-content">
                <div className="assessment-overview">
                  <h3>Assessment Structure</h3>
                  <p>This course uses {course.examBoard} assessment methods to ensure comprehensive evaluation of student knowledge and skills.</p>
                </div>
                <div className="assessment-breakdown">
                  {course.assessmentBreakdown.map((assessment, index) => (
                    <div key={index} className="assessment-item">
                      <div className="assessment-header">
                        <h4>{assessment.type}</h4>
                        <span className="assessment-weight">{assessment.weight}</span>
                      </div>
                      <p>{assessment.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="course-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start {course.shortTitle}?</h2>
            <p>Join thousands of students who have achieved success with our expertly designed IGCSE courses.</p>
            <div className="cta-actions">
              <button className="cta-btn primary" onClick={addCourseToQuote}>
                Add {course.shortTitle} to Quote
              </button>
              <Link to="/learning-portal/igcse/courses" className="cta-btn secondary">
                Browse More Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IGCSECourseDetail;








