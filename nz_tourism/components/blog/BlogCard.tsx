'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '../../services/blogService';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} className="blog-card-link">
        <div className="blog-card-image">
          <Image
            src={post.featuredImage || '/images/blog/default.jpg'}
            alt={post.title}
            width={400}
            height={250}
            className="card-image"
          />
          {post.category && (
            <span className="category-badge">{post.category}</span>
          )}
        </div>
        
        <div className="blog-card-content">
          <h3 className="blog-card-title">
            {truncateText(post.title, 80)}
          </h3>
          
          <p className="blog-card-summary">
            {truncateText(post.summary, 150)}
          </p>
          
          <div className="blog-card-meta">
            <div className="author-info">
              <Image
                src={post.authorAvatar || '/images/avatars/default.jpg'}
                alt={post.authorName}
                width={24}
                height={24}
                className="author-avatar"
              />
              <span className="author-name">{post.authorName}</span>
            </div>
            
            <div className="post-stats">
              <span className="post-date">
                {formatDate(post.publishedAt)}
              </span>
              <span className="view-count">
                👁 {post.viewCount}
              </span>
              <span className="comment-count">
                💬 {post.commentCount}
              </span>
            </div>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="blog-card-tags">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="tag-more">+{post.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
} 