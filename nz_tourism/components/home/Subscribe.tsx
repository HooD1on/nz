import React from 'react';

interface SubscribeProps {
  // You can add props here if needed in the future
}

export default function Subscribe({}: SubscribeProps = {}) {
  return (
    <section className="subscribe">
      <div className="container">
        <h2 className="subscribe-title">START YOUR ADVENTURE</h2>
        <p className="subscribe-desc">Sign up for our newsletter and receive exclusive travel deals, travel tips, and destination inspiration. Don't miss out on the adventure - you're in for a treat!</p>
        
        <div className="subscribe-form">
          <input type="email" className="subscribe-input" placeholder="Enter your email address here..." />
          <button className="subscribe-btn">Subscribe</button>
        </div>
      </div>
    </section>
  );
} 