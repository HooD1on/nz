'use client';

import React, { useState } from 'react';
import { SearchIcon } from './SearchIcon';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export default function TailwindPrefixSearchBar({
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
    <div className="tw-search-container">
      <form onSubmit={handleSubmit} className="tw-search-form">
        <div className="tw-search-input-container">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="tw-search-input"
          />
          <div className="tw-search-icon-container">
            <SearchIcon />
          </div>
        </div>
        <button type="submit" className="tw-search-button">
          {buttonText}
        </button>
      </form>
    </div>
  );
} 