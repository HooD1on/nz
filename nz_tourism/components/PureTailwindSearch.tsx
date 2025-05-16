'use client';

import React, { useState } from 'react';

interface SearchProps {
  onSearch?: (query: string) => void;
}

export default function PureTailwindSearch({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    alert(`您搜索了: ${query}`);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center border border-gray-300 rounded-md overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索..."
          className="w-full px-4 py-2 focus:outline-none"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          搜索
        </button>
      </form>
    </div>
  );
} 