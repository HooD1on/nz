'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { blogService, BlogPost, BlogComment } from '@/services/blogService';
import '@/styles/pages/blog-detail.css';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post) {
      loadRelatedPosts();
      loadComments();
      incrementViewCount();
    }
  }, [post]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await blogService.getPostBySlug(slug);
      if (response.success && response.data) {
        setPost(response.data);
      } else {
        setError(response.error || 'Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async () => {
    if (!post) return;
    try {
      const response = await blogService.getRelatedPosts(post.id, 3);
      if (response.success) {
        setRelatedPosts(response.data || []);
      }
    } catch (err) {
      console.error('Error loading related posts:', err);
    }
  };

  const loadComments = async () => {
    if (!post) return;
    try {
      const response = await blogService.getCommentsByPostId(post.id);
      if (response.success) {
        setComments(response.data || []);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const incrementViewCount = async () => {
    if (!post) return;
    try {
      await blogService.incrementViewCount(post.id);
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await blogService.createComment({
        content: newComment,
        blogPostId: post.id,
      });
      
      if (response.success) {
        setNewComment('');
        loadComments(); // 重新加载评论
      } else {
        alert(response.error || 'Failed to submit comment');
      }
    } catch (err) {
      alert('Failed to submit comment');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-error">
        <h1>404 - 文章未找到</h1>
        <p>{error || '您要查找的文章不存在或已被删除。'}</p>
        <Link href="/blog" className="back-to-blog">
          返回博客列表
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="container">
        {/* 返回按钮 */}
        <div className="blog-navigation">
          <Link href="/blog" className="back-button">
            ← 返回博客列表
          </Link>
        </div>

        {/* 文章主体 */}
        <article className="blog-post">
          {/* 文章头部 */}
          <header className="post-header">
            {post.featuredImage && (
              <div className="featured-image">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="post-image"
                />
              </div>
            )}
            
            <div className="post-meta-header">
              {post.category && (
                <span className="post-category">{post.category}</span>
              )}
              <h1 className="post-title">{post.title}</h1>
              <p className="post-summary">{post.summary}</p>
              
              <div className="post-meta">
                <div className="author-info">
                  <Image
                    src={post.authorAvatar || '/images/avatars/default.jpg'}
                    alt={post.authorName}
                    width={40}
                    height={40}
                    className="author-avatar"
                  />
                  <div className="author-details">
                    <span className="author-name">{post.authorName}</span>
                    <span className="post-date">{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
                
                <div className="post-stats">
                  <span className="view-count">👁 {post.viewCount}</span>
                  <span className="comment-count">💬 {post.commentCount}</span>
                </div>
              </div>
            </div>
          </header>

          {/* 文章内容 */}
          <div className="post-content">
            <div 
              className="content-body" 
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              <h3>标签</h3>
              <div className="tags-list">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/blog?tag=${tag}`}
                    className="tag-link"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* 相关文章 */}
        {relatedPosts.length > 0 && (
          <section className="related-posts">
            <h2>相关文章</h2>
            <div className="related-posts-grid">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="related-post-card"
                >
                  <div className="related-post-image">
                    <Image
                      src={relatedPost.featuredImage || '/images/blog/default.jpg'}
                      alt={relatedPost.title}
                      width={300}
                      height={200}
                      className="card-image"
                    />
                  </div>
                  <div className="related-post-content">
                    <h3 className="related-post-title">{relatedPost.title}</h3>
                    <p className="related-post-summary">{relatedPost.summary}</p>
                    <span className="related-post-date">
                      {formatDate(relatedPost.publishedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 评论区 */}
        <section className="comments-section">
          <h2>评论 ({comments.length})</h2>
          
          {/* 评论表单 */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <h3>发表评论</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享您对这篇文章的看法..."
              className="comment-input"
              rows={4}
              required
            />
            <button 
              type="submit" 
              className="submit-comment"
              disabled={submittingComment || !newComment.trim()}
            >
              {submittingComment ? '提交中...' : '发表评论'}
            </button>
            <p className="comment-notice">
              您的评论将在审核后显示。
            </p>
          </form>

          {/* 评论列表 */}
          {comments.length > 0 ? (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <Image
                      src={comment.userAvatar || '/images/avatars/default.jpg'}
                      alt={comment.userName}
                      width={32}
                      height={32}
                      className="commenter-avatar"
                    />
                    <div className="comment-meta">
                      <span className="commenter-name">{comment.userName}</span>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="comment-content">
                    <p>{comment.content}</p>
                  </div>
                  
                  {/* 回复 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="reply-item">
                          <div className="comment-header">
                            <Image
                              src={reply.userAvatar || '/images/avatars/default.jpg'}
                              alt={reply.userName}
                              width={28}
                              height={28}
                              className="commenter-avatar"
                            />
                            <div className="comment-meta">
                              <span className="commenter-name">{reply.userName}</span>
                              <span className="comment-date">
                                {formatDate(reply.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="comment-content">
                            <p>{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-comments">
              <p>还没有评论，快来发表您的看法吧！</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
} 
