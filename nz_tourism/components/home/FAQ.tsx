import React, { useState } from 'react';

interface FAQProps {
  // You can add props here if needed in the future
}

export default function FAQ({}: FAQProps = {}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  
  const toggleFaq = (index: number): void => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section className="faq section">
      <div className="container">
        <h2 className="section-title">FREQUENTLY ASKED QUESTIONS</h2>
        <p className="section-description">What our clients recently asked about our services and tours.</p>
        
        <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`}>
          <div className="faq-question" onClick={() => toggleFaq(0)}>
            <div className="question-text">What type of travel packages does VacaSky offer?</div>
            <div className="faq-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
          <div className="faq-answer">
            <p>VacaSky offers a wide range of travel packages to suit different preferences and interests. Our most popular options include cultural immersion tours, adventure experiences, luxury getaways, and family-friendly vacation packages. Each package can be customized to meet your specific needs and preferences.</p>
          </div>
        </div>
        
        <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`}>
          <div className="faq-question" onClick={() => toggleFaq(1)}>
            <div className="question-text">How do I book a trip with VacaSky?</div>
            <div className="faq-toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          </div>
          <div className="faq-answer">
            <p>Booking with VacaSky is easy and straightforward. You can browse our available packages on our website, select your preferred destination and dates, and proceed with the booking process online. Alternatively, you can contact our customer service team for personalized assistance.</p>
          </div>
        </div>
      </div>
    </section>
  );
} 