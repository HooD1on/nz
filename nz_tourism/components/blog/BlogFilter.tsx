'use client';

import { useState, useEffect } from 'react';
import { BlogCategory } from '../../services/blogService';

interface BlogFilterProps {
  categories: BlogCategory[];
  popularTags: string[];
  onSearch: (filters: any) => void;
  initialFilters?: any;
}

export default function BlogFilter({ 
  categories, 
  popularTags, 
  onSearch, 
  initialFilters = {} 
}: BlogFilterProps) {
  const [keyword, setKeyword] = useState(initialFilters.keyword || '');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [selectedTag, setSelectedTag] = useState(initialFilters.tag || '');
  const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'publishedAt');
  const [sortDescending, setSortDescending] = useState(initialFilters.sortDescending ?? true);

  useEffect(() => {
    // 当初始筛选条件改变时更新状态
    setKeyword(initialFilters.keyword || '');
    setSelectedCategory(initialFilters.category || '');
    setSelectedTag(initialFilters.tag || '');
    setSortBy(initialFilters.sortBy || 'publishedAt');
    setSortDescending(initialFilters.sortDescending ?? true);
  }, [initialFilters]);

  const handleSearch = () => {
    onSearch({
      keyword: keyword.trim() || undefined,
      category: selectedCategory || undefined,
      tag: selectedTag || undefined,
      sortBy,
      sortDescending,
    });
  };

  const handleClear = () => {
    setKeyword('');
    setSelectedCategory('');
    setSelectedTag('');
    setSortBy('publishedAt');
    setSortDescending(true);
    onSearch({
      sortBy: 'publishedAt',
      sortDescending: true,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="blog-filter">
      <div className="filter-row">
        {/* 搜索框 */}
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索博客文章..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            🔍
          </button>
        </div>

        {/* 分类筛选 */}
        <div className="filter-group">
          <label className="filter-label">分类:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">所有分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name} ({category.postCount})
              </option>
            ))}
          </select>
        </div>

        {/* 标签筛选 */}
        <div className="filter-group">
          <label className="filter-label">标签:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="filter-select"
          >
            <option value="">所有标签</option>
            {popularTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>

        {/* 排序 */}
        <div className="filter-group">
          <label className="filter-label">排序:</label>
          <select
            value={`${sortBy}-${sortDescending}`}
            onChange={(e) => {
              const [field, desc] = e.target.value.split('-');
              setSortBy(field);
              setSortDescending(desc === 'true');
            }}
            className="filter-select"
          >
            <option value="publishedAt-true">最新发布</option>
            <option value="publishedAt-false">最早发布</option>
            <option value="viewCount-true">最多浏览</option>
            <option value="title-false">标题 A-Z</option>
            <option value="title-true">标题 Z-A</option>
          </select>
        </div>

        {/* 操作按钮 */}
        <div className="filter-actions">
          <button onClick={handleSearch} className="apply-button">
            应用筛选
          </button>
          <button onClick={handleClear} className="clear-button">
            清空
          </button>
        </div>
      </div>

      {/* 当前筛选条件显示 */}
      {(keyword || selectedCategory || selectedTag) && (
        <div className="active-filters">
          <span className="active-filters-label">当前筛选:</span>
          {keyword && (
            <span className="filter-tag">
              关键词: {keyword}
              <button 
                onClick={() => { setKeyword(''); handleSearch(); }}
                className="remove-filter"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="filter-tag">
              分类: {categories.find(c => c.slug === selectedCategory)?.name}
              <button 
                onClick={() => { setSelectedCategory(''); handleSearch(); }}
                className="remove-filter"
              >
                ×
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="filter-tag">
              标签: #{selectedTag}
              <button 
                onClick={() => { setSelectedTag(''); handleSearch(); }}
                className="remove-filter"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
} 