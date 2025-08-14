const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5152/api';

interface ServiceResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  featuredImage: string;
  slug: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  viewCount: number;
  tags: string[];
  category: string;
  metaDescription: string;
  metaKeywords: string;
  commentCount: number;
  comments: BlogComment[];
}

interface BlogComment {
  id: string;
  content: string;
  blogPostId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  parentCommentId?: string;
  isApproved: boolean;
  createdAt: string;
  replies: BlogComment[];
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

interface BlogSearchParams {
  keyword?: string;
  category?: string;
  tag?: string;
  authorId?: string;
  isPublished?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

interface BlogPostCreateDto {
  title: string;
  content: string;
  summary: string;
  featuredImage: string;
  slug?: string;
  isPublished: boolean;
  tags: string[];
  category: string;
  metaDescription: string;
  metaKeywords: string;
}

interface BlogCommentCreateDto {
  content: string;
  blogPostId: string;
  parentCommentId?: string;
}

class BlogService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ServiceResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private getAuthHeaders(): Record<string, string> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
    return {};
  }

  // 博客文章相关
  async getAllPosts(params: BlogSearchParams = {}): Promise<ServiceResponse<BlogPost[]>> {
    const queryParams = new URLSearchParams();
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.category) queryParams.append('category', params.category);
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.authorId) queryParams.append('authorId', params.authorId);
    if (params.isPublished !== undefined) queryParams.append('isPublished', params.isPublished.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDescending !== undefined) queryParams.append('sortDescending', params.sortDescending.toString());

    const endpoint = `/blog?${queryParams.toString()}`;
    return this.makeRequest<BlogPost[]>(endpoint);
  }

  async getPostById(id: string): Promise<ServiceResponse<BlogPost>> {
    return this.makeRequest<BlogPost>(`/blog/${id}`);
  }

  async getPostBySlug(slug: string): Promise<ServiceResponse<BlogPost>> {
    return this.makeRequest<BlogPost>(`/blog/slug/${slug}`);
  }

  async createPost(postData: BlogPostCreateDto): Promise<ServiceResponse<BlogPost>> {
    return this.makeRequest<BlogPost>('/blog', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, postData: BlogPostCreateDto): Promise<ServiceResponse<BlogPost>> {
    return this.makeRequest<BlogPost>(`/blog/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id: string): Promise<ServiceResponse<boolean>> {
    return this.makeRequest<boolean>(`/blog/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  async publishPost(id: string): Promise<ServiceResponse<boolean>> {
    return this.makeRequest<boolean>(`/blog/${id}/publish`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
  }

  async unpublishPost(id: string): Promise<ServiceResponse<boolean>> {
    return this.makeRequest<boolean>(`/blog/${id}/unpublish`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
  }

  async incrementViewCount(id: string): Promise<ServiceResponse<BlogPost>> {
    return this.makeRequest<BlogPost>(`/blog/${id}/view`, {
      method: 'POST',
    });
  }

  async getRecentPosts(limit: number = 5): Promise<ServiceResponse<BlogPost[]>> {
    return this.makeRequest<BlogPost[]>(`/blog/recent?limit=${limit}`);
  }

  async getRelatedPosts(postId: string, limit: number = 3): Promise<ServiceResponse<BlogPost[]>> {
    return this.makeRequest<BlogPost[]>(`/blog/${postId}/related?limit=${limit}`);
  }

  // 评论相关
  async getCommentsByPostId(postId: string): Promise<ServiceResponse<BlogComment[]>> {
    return this.makeRequest<BlogComment[]>(`/blog/${postId}/comments`);
  }

  async createComment(commentData: BlogCommentCreateDto): Promise<ServiceResponse<BlogComment>> {
    return this.makeRequest<BlogComment>('/blog/comments', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(commentId: string): Promise<ServiceResponse<boolean>> {
    return this.makeRequest<boolean>(`/blog/comments/${commentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  async approveComment(commentId: string): Promise<ServiceResponse<boolean>> {
    return this.makeRequest<boolean>(`/blog/comments/${commentId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
  }

  // 分类相关
  async getCategories(): Promise<ServiceResponse<BlogCategory[]>> {
    return this.makeRequest<BlogCategory[]>('/blog/categories');
  }

  async createCategory(categoryData: Omit<BlogCategory, 'id' | 'postCount'>): Promise<ServiceResponse<BlogCategory>> {
    return this.makeRequest<BlogCategory>('/blog/categories', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<ServiceResponse<boolean>> {
    return this.makeRequest<boolean>(`/blog/categories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  // 统计相关
  async getBlogStats(): Promise<ServiceResponse<any>> {
    return this.makeRequest<any>('/blog/stats');
  }

  async getPopularTags(limit: number = 20): Promise<ServiceResponse<string[]>> {
    return this.makeRequest<string[]>(`/blog/tags?limit=${limit}`);
  }
}

export const blogService = new BlogService();

export type {
  BlogPost,
  BlogComment,
  BlogCategory,
  BlogSearchParams,
  BlogPostCreateDto,
  BlogCommentCreateDto,
  ServiceResponse,
}; 