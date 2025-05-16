'use client';

import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen = false,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  
  // 使用提供的onToggle，或者自行处理展开/收起状态
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsExpanded(!isExpanded);
    }
  };
  
  // 确定当前是否展开（根据props或内部状态）
  const currentlyExpanded = onToggle ? isOpen : isExpanded;

  return (
    <li className="faq-item">
      <button
        className="faq-button"
        onClick={handleToggle}
      >
        <span className="faq-question">{question}</span>
        <svg
          className={`faq-icon ${currentlyExpanded ? 'open' : ''}`}
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {currentlyExpanded && (
        <div className="faq-answer">
          {answer}
        </div>
      )}
    </li>
  );
};

export default FAQItem; 