import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="page-header">
      <div className="container">
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default PageHeader;
