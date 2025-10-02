import React from 'react';
import { Link } from 'react-router-dom';
import './ASLevelCourses.css';

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

interface Course {
  id: string;
  title: string;
  image: string;
  price: string;
  originalPrice: string;
  currentPrice: string;
}

const ASLevelCourses: React.FC = () => {
  const courses: Course[] = [
    {
      id: 'as-biology',
      title: 'International AS Biology (Pearson)',
      image: ASBiology,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-business',
      title: 'International AS Business (Pearson)',
      image: ASBusiness,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-chemistry',
      title: 'International AS Chemistry (Pearson)',
      image: ASChemistry,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-english',
      title: 'International AS English Language (Cambridge)',
      image: ASEnglish,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-geography-pearson',
      title: 'International AS Geography (Cambridge)',
      image: ASGeographyPearson,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-geography-cambridge',
      title: 'International AS Geography (Pearson)',
      image: ASGeographyCambridge,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-environment-management',
      title: 'International AS Level Environmental Management 8291 (Cambridge)',
      image: ASEnvironmentManagement,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-math',
      title: 'International AS Mathematics (Pearson)',
      image: ASMath,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-physics',
      title: 'International AS Physics (Pearson)',
      image: ASPhysics,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    },
    {
      id: 'as-religious-studies',
      title: 'International AS Religious Studies (Pearson)',
      image: ASReligiousStudies,
      price: 'R350',
      originalPrice: 'R350',
      currentPrice: 'R350'
    }
  ];

  return (
    <div className="aslevel-courses">
      <div className="breadcrumb">
        <div className="container">
          <Link to="/learning-portal/as-levels">← Back to International AS Level</Link>
        </div>
      </div>
      
      <div className="hero-section">
        <div className="container">
          <h1>AS Level Courses</h1>
          <p>Choose from our comprehensive range of Pearson Edexcel and Cambridge AS Level courses</p>
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

export default ASLevelCourses; 