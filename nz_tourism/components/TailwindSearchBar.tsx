'use client';

import React, { useState } from 'react';
import { SearchIcon } from './SearchIcon';

interface TailwindSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  buttonText?: string;
}

export default function TailwindSearchBar({
  onSearch,
  placeholder = "搜索...",
  buttonText = "搜索"
}: TailwindSearchBarProps) {
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
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full py-3.5 px-5 pl-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition duration-200"
          />
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </div>
        </div>
        <button 
          type="submit" 
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition duration-200 whitespace-nowrap"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
} 