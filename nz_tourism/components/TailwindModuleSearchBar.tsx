'use client';

import React, { useState } from 'react';
import styles from './TailwindModuleSearchBar.module.css';
import { SearchIcon } from './SearchIcon';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export default function TailwindModuleSearchBar({
  onSearch,
  placeholder = "搜索...",
  buttonText = "搜索"
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      alert(`搜索: ${query}`);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div className={styles.searchInputContainer}>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={styles.searchInput}
          />
          <div className={styles.searchIconContainer}>
            <SearchIcon />
          </div>
        </div>
        <button type="submit" className={styles.searchButton}>
          {buttonText}
        </button>
      </form>
    </div>
  );
} 