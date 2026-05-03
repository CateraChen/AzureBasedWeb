import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../components/common/GlassCard';
import PageHero from '../components/common/PageHero';


const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const timelineEvents = [
    { year: '2020', desc: t('about.history_2020') },
    { year: '2022', desc: t('about.history_2022') },
    { year: '2024', desc: t('about.history_2024') }
  ];

  return (
    <div className="about-page bg-dark">
      <PageHero 
        title={t('about.title')} 
        subtitle={t('about.subtitle')}
      />

      <div className="container py-5">
        <section className="mission-section mb-10">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
               <h2 className="text-gold mb-4 serif-font">{t('about.mission')}</h2>
               <p className="large-lead">{t('about.mission_text')}</p>
            </div>
          </div>
        </section>

        <section className="timeline-section">
          <h2 className="text-center text-gold mb-5 serif-font">{t('about.history_title')}</h2>
          <div className="timeline-container">
             {timelineEvents.map((event, idx) => (
               <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                 <GlassCard intensity="medium" className="timeline-card">
                    <div className="timeline-year">{event.year}</div>
                    <p className="timeline-desc">{event.desc}</p>
                 </GlassCard>
               </div>
             ))}
             <div className="timeline-line"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;