import React from 'react';
import { Link } from 'react-router-dom';
import './GCSEcourses.css';

// Import all GCSE course images
import GCSEAfrikaans from '../assets/GCSE Afrikaans.jpeg';
import GCSEBiology from '../assets/GCSE Biology.jpeg';
import GCSEBusiness from '../assets/GCSE Business.jpg';
import GCSEEnglish from '../assets/GCSE English.jpeg';
import GSECEChemistry from '../assets/GCSE Chemistry.jpeg';
import GCSEEnvironmentalManagement from '../assets/GCSE Environmental management.jpeg';
import GCSEGeography from '../assets/GCSE Geography Cambridge.jpeg';
import GCSEHistory from '../assets/GCSE History.jpeg';
import GCSEMath from '../assets/GCSE Math.jpg';
import GCSEPhysics from '../assets/GCSE Physics.jpeg';
import GCSEReligiousStudies from '../assets/GCSE Religious Studies.png';

interface Course {
  id: string;
  title: string;
  image: string;
  price: string;
  originalPrice: string;
  currentPrice: string;
}

const GCSEcourses: React.FC = () => {
  const courses: Course[] = [
    {
      id: 'gcse-afrikaans',
      title: 'International GCSE Afrikaans – Second Language (Cambridge)',
      image: GCSEAfrikaans,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-biology',
      title: 'International GCSE Biology (Pearson)',
      image: GCSEBiology,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-business',
      title: 'International GCSE Business Studies (Pearson)',
      image: GCSEBusiness,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-english',
      title: 'International GCSE English Language (Pearson)',
      image: GCSEEnglish,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-chemistry',
      title: 'International GCSE in Chemistry (Pearson)',
      image: GSECEChemistry,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-environmental-management',
      title: 'International GCSE Environmental Management (Cambridge)',
      image: GCSEEnvironmentalManagement,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-geography',
      title: 'International GCSE Geography (Pearson)',
      image: GCSEGeography,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-history',
      title: 'International GCSE History (Pearson)',
      image: GCSEHistory,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-math',
      title: 'International GCSE Mathematics (Pearson)',
      image: GCSEMath,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-physics',
      title: 'International GCSE Physics (Pearson)',
      image: GCSEPhysics,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'gcse-religious-studies',
      title: 'International Religious Studies (Pearson)',
      image: GCSEReligiousStudies,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    }
  ];

  return (
    <div className="gcse-courses">
      <div className="breadcrumb">
        <div className="container">
          <Link to="/learning-portal/igcse">← Back to International GCSE</Link>
        </div>
      </div>
      
      <div className="hero-section">
        <div className="container">
          <h1>IGCSE Courses</h1>
          <p>Choose from our comprehensive range of Pearson Edexcel and Cambridge IGCSE courses</p>
        </div>
      </div>
      
      <div className="courses-section">
        <div className="container">
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                </div>
                <div className="course-content">
                  <Link to="/shop" className="course-title">
                    {course.title}
                  </Link>
                  <div className="course-pricing">
                    <span className="price">{course.price}</span>
                    <span className="original-price">Original price was: {course.originalPrice}</span>
                    <span className="current-price">Current price is: {course.currentPrice} /month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCSEcourses; 