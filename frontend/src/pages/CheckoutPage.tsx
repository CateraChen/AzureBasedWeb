import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import GlassCard from '../components/common/GlassCard';
import PageHero from '../components/common/PageHero';


const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const { cart, clear } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const cartItems = cart.items || [];
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await clear();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="checkout-page bg-dark min-vh-100 d-flex align-items-center justify-content-center pt-20">
         <div className="container text-center">
            <GlassCard intensity="strong" className="p-5 mx-auto" style={{ maxWidth: '600px' }}>
               <h1 className="text-gold serif-font mb-4">✧ {t('checkout.success_title')} ✧</h1>
               <p className="large-lead mb-5">{t('checkout.success_text')}</p>
               <button className="btn-luxury" onClick={() => window.location.href = '/'}>
                 {t('nav.home').toUpperCase()}
               </button>
            </GlassCard>
         </div>
      </div>
    );
  }

  return (
    <div className="checkout-page bg-dark pb-10">
      <PageHero 
        title={t('checkout.title')} 
        subtitle={t('checkout.subtitle')} 
      />

      <div className="container py-5">
        <div className="row g-5">
          {/* Inquiry Summary (Left) */}
          <div className="col-lg-7">
             <GlassCard intensity="medium" className="summary-card mb-5">
                <h2 className="serif-font text-gold mb-4">{t('checkout.summary_title')}</h2>
                <div className="checkout-item-list">
                   {cartItems.map((item) => (
                     <div key={item.id} className="checkout-item mb-3">
                        <div className="d-flex justify-content-between">
                           <span className="item-name">{item.name} × {item.quantity}</span>
                           <span className="item-price">¥ {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="total-bar mt-5 pt-3 border-top border-gold">
                   <div className="d-flex justify-content-between">
                      <span className="serif-font text-gold fs-4">Total</span>
                      <span className="serif-font text-gold fs-4">¥ {total.toLocaleString()}</span>
                   </div>
                </div>
             </GlassCard>
          </div>

          {/* Checkout Form (Right) */}
          <div className="col-lg-5">
             <GlassCard intensity="strong" className="checkout-form-card">
                <h2 className="serif-font text-gold mb-4">{t('checkout.form_title')}</h2>
                <form onSubmit={handleSubmit} className="glow-form">
                   <div className="mb-4">
                      <label className="form-label">{t('checkout.form_company')}</label>
                      <input type="text" className="glass-input" required />
                   </div>
                   <div className="mb-4">
                      <label className="form-label">{t('contact.form_email')}</label>
                      <input type="email" className="glass-input" required />
                   </div>
                   <div className="mb-5">
                      <label className="form-label">{t('checkout.form_country')}</label>
                      <select className="glass-input">
                         <option>China</option>
                         <option>United States</option>
                         <option>Europe</option>
                         <option>Other</option>
                      </select>
                   </div>
                   <button type="submit" className="btn-glamorous w-100">
                      {t('checkout.submit_quote')}
                   </button>
                </form>
             </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;