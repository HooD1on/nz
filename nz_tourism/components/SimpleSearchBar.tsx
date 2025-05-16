'use client';

import React, { useState, CSSProperties } from 'react';

interface SimpleSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
}

const SimpleSearchBar: React.FC<SimpleSearchBarProps> = ({
  onSearch,
  placeholder = "搜索目的地...",
  buttonText = "搜索"
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // 基础样式
  const styles: Record<string, CSSProperties> = {
    container: {
      width: '100%',
      marginTop: '0.5rem',
      marginBottom: '0.5rem',
    },
    form: {
      display: 'flex',
      gap: '0.5rem',
    },
    inputContainer: {
      position: 'relative',
      flexGrow: 1,
    },
    input: {
      width: '100%',
      padding: '0.625rem 1rem',
      paddingLeft: '2.5rem',
      fontSize: '0.875rem',
      color: '#1f2937',
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      outline: 'none',
    },
    iconContainer: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none' as 'none',
      color: '#6b7280',
    },
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.625rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'white',
      backgroundColor: '#2563eb',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
    icon: {
      marginRight: '0.5rem',
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          />
          <div style={styles.iconContainer}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        <button type="submit" style={styles.button}>
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default SimpleSearchBar; 