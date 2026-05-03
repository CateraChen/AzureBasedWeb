import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand-info">
          <h3>{t('brand.name')}</h3>
          <p>{t('brand.subtitle')}</p>
          <p className="auth-statement">{t('footer.auth_statement')}</p>
        </div>
        
        <div className="footer-section links">
          <Link to="/privacy">{t('footer.links.privacy')}</Link>
          <Link to="/terms">{t('footer.links.terms')}</Link>
          <Link to="/shipping">{t('footer.links.shipping')}</Link>
          <Link to="/returns">{t('footer.links.returns')}</Link>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>{t('footer.copyright').replace('2024', currentYear.toString())}</p>
      </div>

      <style>{`
        .footer {
          background-color: #1a1a1a;
          color: #ffffff;
          padding: 4rem 2rem 2rem;
          margin-top: 4rem;
          border-top: 1px solid #333;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
        }
        .footer-section h3 {
          margin: 0;
          font-size: 1.5rem;
          letter-spacing: 2px;
        }
        .brand-info p {
          color: #888;
          margin: 0.5rem 0;
        }
        .auth-statement {
          font-size: 0.85rem;
          color: #c5a059 !important; /* Gold tone matches premium theme */
          font-weight: 500;
        }
        .links {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .links a {
          color: #aaa;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }
        .links a:hover {
          color: #fff;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 3rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid #333;
          text-align: center;
          font-size: 0.8rem;
          color: #666;
        }
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            text-align: center;
          }
          .links {
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;