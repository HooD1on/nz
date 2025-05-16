'use client';

import React, { useState } from 'react';

interface SearchCategory {
  id: string;
  name: string;
}

interface AdvancedSearchBarProps {
  onSearch?: (query: string, category: string) => void;
  placeholder?: string;
  className?: string;
  buttonText?: string;
  categories?: SearchCategory[];
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  onSearch,
  placeholder = "搜索目的地、景点或活动...",
  className = "",
  buttonText = "搜索",
  categories = [
    { id: 'all', name: '全部' },
    { id: 'destinations', name: '目的地' },
    { id: 'attractions', name: '景点' },
    { id: 'activities', name: '活动' },
    { id: 'tours', name: '旅行团' },
  ]
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedCategory);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowDropdown(false);
  };

  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || categories[0].name;

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
        <div className="relative md:w-1/4">
          <button 
            type="button"
            className="w-full h-full px-4 py-3 text-left text-sm bg-white border border-gray-300 rounded-lg md:rounded-r-none md:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex items-center justify-between">
              <span>{selectedCategoryName}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>
          
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              <ul className="py-1 space-y-1">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      type="button"
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${selectedCategory === category.id ? 'bg-blue-50 text-blue-600' : ''}`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
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
            className="w-full p-3 pl-10 text-sm text-gray-900 bg-white border border-gray-300 md:rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none rounded-lg"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          type="submit" 
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg md:rounded-l-none md:rounded-r-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition duration-150 ease-in-out"
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

export default AdvancedSearchBar; 