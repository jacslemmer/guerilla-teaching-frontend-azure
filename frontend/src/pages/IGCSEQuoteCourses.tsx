import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, Product } from '@guerilla-teaching/shared-types';

const IGCSEQuoteCourses: React.FC = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<CartItem[]>([]);

  const courses: Product[] = [
    {
      id: 'igcse-math',
      name: 'IGCSE Mathematics',
      description: 'Comprehensive mathematics course covering algebra, geometry, statistics, and calculus fundamentals.',
      price: 299.99,
      image: '/images/courses/igcse-math.jpg',
      category: 'IGCSE',
      inStock: true,
      featured: true,
      tags: ['IGCSE', 'Mathematics']
    },
    {
      id: 'igcse-physics',
      name: 'IGCSE Physics',
      description: 'Explore the fundamental principles of physics including mechanics, electricity, waves, and atomic physics.',
      price: 329.99,
      image: '/images/courses/igcse-physics.jpg',
      category: 'IGCSE',
      inStock: true,
      featured: true,
      tags: ['IGCSE', 'Physics']
    },
    {
      id: 'igcse-chemistry',
      name: 'IGCSE Chemistry',
      description: 'Comprehensive chemistry course covering atomic structure, bonding, acids and bases, and organic chemistry.',
      price: 329.99,
      image: '/images/courses/igcse-chemistry.jpg',
      category: 'IGCSE',
      inStock: true,
      featured: false,
      tags: ['IGCSE', 'Chemistry']
    }
  ];

  const addToQuote = (course: Product) => {
    const existingQuote = localStorage.getItem('quoteRequest');
    let quoteRequest: CartItem[] = existingQuote ? JSON.parse(existingQuote) : [];

    const existingItem = quoteRequest.find(item => item.product.id === course.id);
    
    if (existingItem) {
      quoteRequest = quoteRequest.map(item =>
        item.product.id === course.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      quoteRequest.push({ product: course, quantity: 1 });
    }

    localStorage.setItem('quoteRequest', JSON.stringify(quoteRequest));
    setQuote([...quoteRequest]);
  };

  const goToQuote = () => {
    navigate('/quote-cart');
  };

  const getQuoteCount = () => {
    const existingQuote = localStorage.getItem('quoteRequest');
    if (!existingQuote) return 0;
    const quoteRequest: CartItem[] = JSON.parse(existingQuote);
    return quoteRequest.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/learning-portal" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Learning Portal
        </Link>
      </div>

      <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>IGCSE Course Selection</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Choose from our comprehensive range of Pearson Edexcel International GCSE courses.
      </p>

      {getQuoteCount() > 0 && (
        <div style={{ background: '#e8f5e8', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
          <span>Quote Request: {getQuoteCount()} course(s)</span>
          <button 
            onClick={goToQuote}
            style={{ marginLeft: '15px', background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            View Quote Request
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {courses.map((course) => (
          <div key={course.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: 'white' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>{course.name}</h3>
            <p style={{ color: '#666', marginBottom: '15px', lineHeight: '1.5' }}>{course.description}</p>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                R {course.price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => addToQuote(course)}
              style={{ 
                width: '100%', 
                background: '#007bff', 
                color: 'white', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Add to Quote
            </button>
          </div>
        ))}
      </div>

      {getQuoteCount() > 0 && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={goToQuote}
            style={{ 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              padding: '15px 30px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}
          >
            Continue to Quote Request ({getQuoteCount()} courses)
          </button>
        </div>
      )}
    </div>
  );
};

export default IGCSEQuoteCourses;