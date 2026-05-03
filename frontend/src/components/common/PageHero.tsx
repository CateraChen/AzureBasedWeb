import React from 'react';

import GlassCard from './GlassCard';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: string;
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  height = '40vh',
  children 
}) => {
  return (
    <section 
      className="page-hero" 
      style={{ 
        minHeight: height,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none'
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <GlassCard intensity="strong" className="hero-text-card">
          <h1 className="hero-title">{title}</h1>
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
          {children}
        </GlassCard>
      </div>
    </section>
  );
};

export default PageHero;