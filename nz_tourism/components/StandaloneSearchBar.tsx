'use client';

import React, { useState, CSSProperties } from 'react';

interface StandaloneSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export default function StandaloneSearchBar({
  onSearch,
  placeholder = "搜索...",
  buttonText = "搜索"
}: StandaloneSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      alert(`搜索: ${query}`);
    }
  };

  // 完全使用内联样式，使用CSSProperties类型
  const styles: Record<string, CSSProperties> = {
    container: {
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto',
    },
    form: {
      display: 'flex',
      width: '100%',
    },
    inputContainer: {
      position: 'relative',
      flexGrow: 1,
    },
    input: {
      width: '100%',
      padding: '10px 16px',
      paddingLeft: '40px',
      fontSize: '14px',
      border: '1px solid #d1d5db',
      borderRadius: '8px 0 0 8px',
      outline: 'none',
    },
    iconContainer: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none' as 'none',
      color: '#6b7280',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '0 8px 8px 0',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
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
} 