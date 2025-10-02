import React, { useState } from 'react';
import './Articles.css';
import Article1 from '../assets/Article1.jpg';
import Article2 from '../assets/Article2.png';
import Article3 from '../assets/Article3.png';
import Article4 from '../assets/Article4.jpg';
import Article5 from '../assets/Article5.jpg';
import { Link } from 'react-router-dom';

const blogData = [
  {
    id: 1,
    image: Article1,
    title: 'The Flipped Classroom',
    author: 'Dan Landi',
    date: 'Mar 25, 2021',
    comments: 0,
    excerpt: 'Our Vision\nWe at Guerilla Teaching have a vision of self-directed learning...'
  },
  {
    id: 2,
    image: Article2,
    title: "Write don’t type",
    author: 'Dan Landi',
    date: 'May 05, 2025',
    comments: 0,
    excerpt: 'Why Handwriting Still Matters in a Digital Age\nInsights from an experienced educator...'
  },
  {
    id: 3,
    image: Article3,
    title: 'Why Choose Pearson?',
    author: 'Dan Landi',
    date: 'May 05, 2025',
    comments: 0,
    excerpt: 'Why Pearson Edexcel is the Ideal Choice\nLooking for a globally recognised qualification...'
  },
  {
    id: 4,
    image: Article4,
    title: 'What are we assessing in examinations?',
    author: 'Dan Landi',
    date: 'Mar 25, 2021',
    comments: 0,
    excerpt: 'It continues to amaze me how entrenched people are in their perspective...'
  },
  {
    id: 5,
    image: Article5,
    title: 'Guerilla Teaching: Developing Excellent Teaching Skills – Notes on Mentoring',
    author: 'Dan Landi',
    date: 'Mar 25, 2021',
    comments: 0,
    excerpt: 'PRINCIPLES OF DIPLOMACIA & EMPATHY\n\nDIPLOMACY: I try to listen to myself talk...'
  }
];

const Articles: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredBlogs = blogData.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="articles-blog-page">
      <h1 className="blog-header">Blog</h1>
      <div className="blog-search-container">
        <input
          type="text"
          className="blog-search"
          placeholder="Search blogs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="blog-list">
        {filteredBlogs.map(blog => (
          <div key={blog.id} className="blog-card blog-summary-card">
            <Link to={`/resources/articles/${blog.id}`} className="blog-image-link">
              <img src={blog.image} alt={blog.title} className="blog-image" />
            </Link>
            <div className="blog-content">
              <Link to={`/resources/articles/${blog.id}`} className="blog-title-link">
                <h2 className="blog-title">{blog.title}</h2>
              </Link>
              <div className="blog-meta-row">
                <span className="blog-author">{blog.author}</span>
                <span className="blog-date">{blog.date}</span>
                <span className="blog-comments">{blog.comments} comments</span>
              </div>
              <div className="blog-body">
                <p>{blog.excerpt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Articles; 