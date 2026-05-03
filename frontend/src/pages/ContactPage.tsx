import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../components/common/GlassCard';
import PageHero from '../components/common/PageHero';
import MarkdownEditor from '../components/common/MarkdownEditor';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Inquiry Sent! Thank you for contacting WanJiaDengHuo.");
  };

  return (
    <div className="contact-page bg-dark pb-10">
      <PageHero 
        title={t('contact.title')} 
        subtitle={t('contact.subtitle')} 
      />

      <div className="container py-5">
        <div className="row g-5">
          {/* Contact Details (Left) */}
          <div className="col-lg-5">
             <div className="contact-info-list zoom-in">
                <div className="info-item mb-5">
                   <h3 className="info-title">{t('contact.address_title')}</h3>
                   <p className="info-text">{t('contact.address_text')}</p>
                </div>
                <div className="info-item mb-5">
                   <h3 className="info-title">{t('contact.phone_title')}</h3>
                   <p className="info-text">+86 (021) 1234-5678</p>
                </div>
                <div className="info-item">
                   <h3 className="info-title">{t('contact.email_title')}</h3>
                   <p className="info-text">trade@wanjiadenghuo.com</p>
                </div>
             </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="col-lg-7">
             <GlassCard intensity="strong" className="contact-form-card">
                <h2 className="serif-font text-gold mb-4">{t('contact.form_submit')}</h2>
                <form onSubmit={handleFormSubmit} className="glow-form">
                   <div className="row">
                      <div className="col-md-6 mb-4">
                         <label className="form-label">{t('contact.form_name')}</label>
                                     <input
                                        type="text"
                                        className="glass-input"
                                        required
                                        title={t('contact.validation_required_name')}
                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t('contact.validation_required_name'))}
                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                     />
                      </div>
                      <div className="col-md-6 mb-4">
                         <label className="form-label">{t('contact.form_email')}</label>
                                     <input
                                        type="email"
                                        className="glass-input"
                                        required
                                        title={t('contact.validation_required_email')}
                                        onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t('contact.validation_required_email'))}
                                        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                     />
                      </div>
                      <div className="col-12 mb-5">
                         <MarkdownEditor
                            value={message}
                            onChange={setMessage}
                            label={t('contact.form_message')}
                            lang={t('contact.lang_code') || 'en'}
                            placeholder={t('contact.form_message_placeholder')}
                         />
                      </div>
                      <div className="col-12">
                         <button type="submit" className="btn-luxury">
                            {t('contact.form_submit')}
                         </button>
                      </div>
                   </div>
                </form>
             </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
