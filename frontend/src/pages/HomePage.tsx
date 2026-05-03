import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';


const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-background-waves">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
        
        <GlassCard intensity="strong" className="hero-center-box">
          <h1 className="hero-title">{t('home.hero_title')}</h1>
          <p className="hero-subtitle">{t('home.hero_subtitle')}</p>
          <Link to="/shop" className="hero-button">
            {t('home.shop_now')}
          </Link>
        </GlassCard>
      </section>

      <div className="home-sections container">
        <section className="philosophy-section">
          <GlassCard intensity="medium" className="philosophy-card">
            <div className="philosophy-content">
              <h2 className="section-title">{t('home.philosophy_title')}</h2>
              <p className="section-text">{t('home.philosophy_text')}</p>
            </div>
          </GlassCard>
        </section>

        <section className="featured-grid">
          <div className="featured-arrival">
             <h2 className="section-title text-center mb-4">{t('home.new_arrivals')}</h2>
             <div className="featured-items">
                {/* Simplified placeholders for new arrivals */}
                {[1, 2, 3].map((i) => (
                  <GlassCard key={i} className="featured-item-placeholder" intensity="light">
                    <div className="placeholder-icon">✧</div>
                    <div className="placeholder-title">WanJia Collection {i}</div>
                  </GlassCard>
                ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;