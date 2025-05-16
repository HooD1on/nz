'use client';

import React, { useState } from 'react';
import styles from '../styles/SearchBar.module.css';

interface SearchBarAltProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  buttonText?: string;
}

const SearchBarAlt: React.FC<SearchBarAltProps> = ({
  onSearch,
  placeholder = "搜索目的地...",
  className = "",
  buttonText = "搜索"
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className={`${styles.searchBarContainer} ${className}`}>
      <form onSubmit={handleSearch} className="search-form flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg 
              className="w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full p-3 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition duration-150 ease-in-out"
        >
          <span className="flex items-center justify-center">
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {buttonText}
          </span>
        </button>
      </form>
    </div>
  );
};

export default SearchBarAlt; 