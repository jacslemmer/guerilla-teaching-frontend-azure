import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          {isHome && (
            <Link to="/">
              <img src="/images/logo.png" alt="Guerilla Teaching Logo" style={{ maxHeight: '120px', width: 'auto', display: 'block' }} />
            </Link>
          )}
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/start-here">Start Here</Link></li>
            <li><Link to="/learning-portal">Learning Portal</Link></li>
            <li><Link to="/resources">Resources</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/can-we-help">Can We Help?</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 