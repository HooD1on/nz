'use client';

import React, { useState } from 'react';

interface SearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function ForcedTailwindSearchBar({ onSearch, placeholder = "搜索..." }: SearchProps) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    alert(`您搜索了: ${query}`);
  };
  
  // 使用Tailwind的样式，但通过style属性直接应用
  const styles = {
    container: {
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto',
    },
    form: {
      display: 'flex',
      border: '1px solid #e5e7eb',
      borderRadius: '0.375rem',
      overflow: 'hidden',
    },
    input: {
      flexGrow: 1,
      padding: '0.5rem 1rem',
      outline: 'none',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.5rem 1rem',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
    }
  };
  
  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          搜索
        </button>
      </form>
    </div>
  );
} 