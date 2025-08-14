'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BlogFilter from '@/components/blog/BlogFilter';
import BlogCard from '@/components/blog/BlogCard';
import Pagination from '@/components/blog/Pagination';
import { blogService, BlogPost } from '@/services/blogService';
import '@/styles/blog.css';

interface BlogSearchParams {
  keyword?: string;
  category?: string;
  tag?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPosts, setTotalPosts] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  const [searchParams, setSearchParams] = useState<BlogSearchParams>({
    page: 1,
    pageSize: 6,
    sortBy: 'publishedAt',
    sortDescending: true
  });

  useEffect(() => {
    loadPosts();
    loadCategories();
    loadPopularTags();
    loadRecentPosts();
  }, [searchParams]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllPosts(searchParams);
      if (response.success) {
        setPosts(response.data || []);
        setTotalPosts(response.data?.length || 0);
      } else {
        setError(response.error || 'Failed to load posts');
      }
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await blogService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadPopularTags = async () => {
    try {
      const response = await blogService.getPopularTags(10);
      if (response.success) {
        setPopularTags(response.data || []);
      }
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const loadRecentPosts = async () => {
    try {
      const response = await blogService.getRecentPosts(5);
      if (response.success) {
        setRecentPosts(response.data || []);
      }
    } catch (err) {
      console.error('Error loading recent posts:', err);
    }
  };

  const handleSearch = (filters: any) => {
    setSearchParams({
      ...searchParams,
      ...filters,
      page: 1
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({
      ...searchParams,
      page
    });
  };

  const totalPages = Math.ceil(totalPosts / searchParams.pageSize);

  return (
    <div className="blog-page">
      <div className="container">
        {/* 页面标题 */}
        <div className="blog-header">
          <h1 className="page-title">新西兰旅游博客</h1>
          <p className="page-description">
            分享最新的新西兰旅游资讯、攻略和体验，帮助您更好地规划新西兰之旅。
          </p>
        </div>

        <div className="blog-layout">
          {/* 主内容区域 */}
          <main className="blog-main">
            {/* 筛选器 */}
            <BlogFilter 
              categories={categories}
              popularTags={popularTags}
              onSearch={handleSearch}
              initialFilters={searchParams}
            />

            {/* 博客文章列表 */}
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={loadPosts} className="retry-button">
                  重试
                </button>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <h3>暂无博客文章</h3>
                <p>还没有发布任何博客文章，请稍后再来查看。</p>
              </div>
            ) : (
              <>
                <div className="blog-grid">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={searchParams.page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </main>

          {/* 侧边栏 */}
          <aside className="blog-sidebar">
            {/* 最新文章 */}
            <div className="sidebar-widget">
              <h3 className="widget-title">最新文章</h3>
              <div className="recent-posts">
                {recentPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    className="recent-post-item"
                  >
                    <div className="recent-post-image">
                      <Image
                        src={post.featuredImage || '/images/blog/default.jpg'}
                        alt={post.title}
                        width={60}
                        height={60}
                        className="post-thumbnail"
                      />
                    </div>
                    <div className="recent-post-content">
                      <h4 className="recent-post-title">{post.title}</h4>
                      <p className="recent-post-date">
                        {new Date(post.publishedAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 热门分类 */}
            <div className="sidebar-widget">
              <h3 className="widget-title">博客分类</h3>
              <div className="categories-list">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog?category=${category.slug}`}
                    className="category-item"
                    style={{ ['--category-color' as any]: category.color }}
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">({category.postCount})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 热门标签 */}
            <div className="sidebar-widget">
              <h3 className="widget-title">热门标签</h3>
              <div className="tags-cloud">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="tag-item"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 