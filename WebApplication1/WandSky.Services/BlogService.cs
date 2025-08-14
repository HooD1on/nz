using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WandSky.Core.DTOs;
using WandSky.Core.Entities;
using WandSky.Infrastructure.Data;
using System.Text.RegularExpressions;

namespace WandSky.Services
{
    public interface IBlogService
    {
        Task<ServiceResponse<List<BlogPostDto>>> GetAllPostsAsync(BlogSearchDto searchDto);
        Task<ServiceResponse<BlogPostDto>> GetPostByIdAsync(Guid id);
        Task<ServiceResponse<BlogPostDto>> GetPostBySlugAsync(string slug);
        Task<ServiceResponse<BlogPostDto>> CreatePostAsync(BlogPostCreateDto createDto, Guid authorId);
        Task<ServiceResponse<BlogPostDto>> UpdatePostAsync(Guid id, BlogPostUpdateDto updateDto, Guid userId);
        Task<ServiceResponse<bool>> DeletePostAsync(Guid id, Guid userId);
        Task<ServiceResponse<bool>> PublishPostAsync(Guid id, Guid userId);
        Task<ServiceResponse<bool>> UnpublishPostAsync(Guid id, Guid userId);
        Task<ServiceResponse<BlogPostDto>> IncrementViewCountAsync(Guid id);
        
        // 评论相关
        Task<ServiceResponse<List<BlogCommentDto>>> GetCommentsByPostIdAsync(Guid postId);
        Task<ServiceResponse<BlogCommentDto>> CreateCommentAsync(BlogCommentCreateDto createDto, Guid userId);
        Task<ServiceResponse<bool>> DeleteCommentAsync(Guid commentId, Guid userId);
        Task<ServiceResponse<bool>> ApproveCommentAsync(Guid commentId, Guid userId);
        
        // 分类相关
        Task<ServiceResponse<List<BlogCategoryDto>>> GetAllCategoriesAsync();
        Task<ServiceResponse<BlogCategoryDto>> CreateCategoryAsync(BlogCategoryCreateDto createDto);
        Task<ServiceResponse<bool>> DeleteCategoryAsync(Guid id);
        
        // 统计相关
        Task<ServiceResponse<BlogStatsDto>> GetBlogStatsAsync();
        Task<ServiceResponse<List<string>>> GetPopularTagsAsync(int limit = 20);
        Task<ServiceResponse<List<BlogPostDto>>> GetRecentPostsAsync(int limit = 5);
        Task<ServiceResponse<List<BlogPostDto>>> GetRelatedPostsAsync(Guid postId, int limit = 3);
    }

    public class BlogService : IBlogService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BlogService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<BlogPostDto>>> GetAllPostsAsync(BlogSearchDto searchDto)
        {
            try
            {
                var query = _context.BlogPosts
                    .Include(p => p.Author)
                    .Include(p => p.Comments.Where(c => c.IsApproved))
                    .AsQueryable();

                // 筛选条件
                if (searchDto.IsPublished.HasValue)
                {
                    query = query.Where(p => p.IsPublished == searchDto.IsPublished.Value);
                }

                if (!string.IsNullOrEmpty(searchDto.Keyword))
                {
                    query = query.Where(p => p.Title.Contains(searchDto.Keyword) ||
                                           p.Content.Contains(searchDto.Keyword) ||
                                           p.Summary.Contains(searchDto.Keyword));
                }

                if (!string.IsNullOrEmpty(searchDto.Category))
                {
                    query = query.Where(p => p.Category == searchDto.Category);
                }

                if (!string.IsNullOrEmpty(searchDto.Tag))
                {
                    query = query.Where(p => p.Tags.Contains(searchDto.Tag));
                }

                if (searchDto.AuthorId.HasValue)
                {
                    query = query.Where(p => p.AuthorId == searchDto.AuthorId.Value);
                }

                // 排序
                query = searchDto.SortBy.ToLower() switch
                {
                    "title" => searchDto.SortDescending ? query.OrderByDescending(p => p.Title) : query.OrderBy(p => p.Title),
                    "publishedat" => searchDto.SortDescending ? query.OrderByDescending(p => p.PublishedAt) : query.OrderBy(p => p.PublishedAt),
                    "viewcount" => searchDto.SortDescending ? query.OrderByDescending(p => p.ViewCount) : query.OrderBy(p => p.ViewCount),
                    _ => searchDto.SortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt)
                };

                // 分页
                var totalCount = await query.CountAsync();
                var posts = await query
                    .Skip((searchDto.Page - 1) * searchDto.PageSize)
                    .Take(searchDto.PageSize)
                    .ToListAsync();

                var postDtos = posts.Select(p => MapToBlogPostDto(p)).ToList();

                return new ServiceResponse<List<BlogPostDto>>
                {
                    Success = true,
                    Data = postDtos,
                    Error = $"Found {totalCount} posts"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<List<BlogPostDto>>
                {
                    Success = false,
                    Error = $"Error retrieving posts: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<BlogPostDto>> GetPostByIdAsync(Guid id)
        {
            try
            {
                var post = await _context.BlogPosts
                    .Include(p => p.Author)
                    .Include(p => p.Comments.Where(c => c.IsApproved))
                        .ThenInclude(c => c.User)
                    .Include(p => p.Comments.Where(c => c.IsApproved))
                        .ThenInclude(c => c.Replies.Where(r => r.IsApproved))
                            .ThenInclude(r => r.User)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (post == null)
                {
                    return new ServiceResponse<BlogPostDto>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                var postDto = MapToBlogPostDto(post);
                postDto.Comments = MapToBlogCommentDtos(post.Comments.Where(c => c.ParentCommentId == null)).ToList();

                return new ServiceResponse<BlogPostDto>
                {
                    Success = true,
                    Data = postDto
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogPostDto>
                {
                    Success = false,
                    Error = $"Error retrieving post: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<BlogPostDto>> GetPostBySlugAsync(string slug)
        {
            try
            {
                var post = await _context.BlogPosts
                    .Include(p => p.Author)
                    .Include(p => p.Comments.Where(c => c.IsApproved))
                        .ThenInclude(c => c.User)
                    .Include(p => p.Comments.Where(c => c.IsApproved))
                        .ThenInclude(c => c.Replies.Where(r => r.IsApproved))
                            .ThenInclude(r => r.User)
                    .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

                if (post == null)
                {
                    return new ServiceResponse<BlogPostDto>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                var postDto = MapToBlogPostDto(post);
                postDto.Comments = MapToBlogCommentDtos(post.Comments.Where(c => c.ParentCommentId == null)).ToList();

                return new ServiceResponse<BlogPostDto>
                {
                    Success = true,
                    Data = postDto
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogPostDto>
                {
                    Success = false,
                    Error = $"Error retrieving post: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<BlogPostDto>> CreatePostAsync(BlogPostCreateDto createDto, Guid authorId)
        {
            try
            {
                var post = new BlogPost
                {
                    Id = Guid.NewGuid(),
                    Title = createDto.Title,
                    Content = createDto.Content,
                    Summary = createDto.Summary,
                    FeaturedImage = createDto.FeaturedImage,
                    Slug = string.IsNullOrEmpty(createDto.Slug) ? GenerateSlug(createDto.Title) : createDto.Slug,
                    IsPublished = createDto.IsPublished,
                    PublishedAt = createDto.IsPublished ? DateTime.UtcNow : null,
                    AuthorId = authorId,
                    Tags = string.Join(",", createDto.Tags),
                    Category = createDto.Category,
                    MetaDescription = createDto.MetaDescription,
                    MetaKeywords = createDto.MetaKeywords,
                    CreatedAt = DateTime.UtcNow
                };

                _context.BlogPosts.Add(post);
                await _context.SaveChangesAsync();

                var createdPost = await GetPostByIdAsync(post.Id);
                return createdPost;
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogPostDto>
                {
                    Success = false,
                    Error = $"Error creating post: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<BlogPostDto>> UpdatePostAsync(Guid id, BlogPostUpdateDto updateDto, Guid userId)
        {
            try
            {
                var post = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == id);
                if (post == null)
                {
                    return new ServiceResponse<BlogPostDto>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                // 检查权限 - 只有作者可以编辑
                if (post.AuthorId != userId)
                {
                    return new ServiceResponse<BlogPostDto>
                    {
                        Success = false,
                        Error = "Unauthorized to edit this post"
                    };
                }

                post.Title = updateDto.Title;
                post.Content = updateDto.Content;
                post.Summary = updateDto.Summary;
                post.FeaturedImage = updateDto.FeaturedImage;
                post.Slug = string.IsNullOrEmpty(updateDto.Slug) ? GenerateSlug(updateDto.Title) : updateDto.Slug;
                post.IsPublished = updateDto.IsPublished;
                post.Tags = string.Join(",", updateDto.Tags);
                post.Category = updateDto.Category;
                post.MetaDescription = updateDto.MetaDescription;
                post.MetaKeywords = updateDto.MetaKeywords;
                post.UpdatedAt = DateTime.UtcNow;

                if (updateDto.IsPublished && post.PublishedAt == null)
                {
                    post.PublishedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                var updatedPost = await GetPostByIdAsync(post.Id);
                return updatedPost;
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogPostDto>
                {
                    Success = false,
                    Error = $"Error updating post: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> DeletePostAsync(Guid id, Guid userId)
        {
            try
            {
                var post = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == id);
                if (post == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                // 检查权限
                if (post.AuthorId != userId)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Unauthorized to delete this post"
                    };
                }

                _context.BlogPosts.Remove(post);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Error = "Post deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"Error deleting post: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> PublishPostAsync(Guid id, Guid userId)
        {
            try
            {
                var post = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == id);
                if (post == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                if (post.AuthorId != userId)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Unauthorized to publish this post"
                    };
                }

                post.IsPublished = true;
                post.PublishedAt = DateTime.UtcNow;
                post.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Error = "Post published successfully"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"Error publishing post: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> UnpublishPostAsync(Guid id, Guid userId)
        {
            try
            {
                var post = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == id);
                if (post == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                if (post.AuthorId != userId)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Unauthorized to unpublish this post"
                    };
                }

                post.IsPublished = false;
                post.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Error = "Post unpublished successfully"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"Error unpublishing post: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<BlogPostDto>> IncrementViewCountAsync(Guid id)
        {
            try
            {
                var post = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == id);
                if (post == null)
                {
                    return new ServiceResponse<BlogPostDto>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                post.ViewCount++;
                await _context.SaveChangesAsync();

                var postDto = await GetPostByIdAsync(id);
                return postDto;
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogPostDto>
                {
                    Success = false,
                    Error = $"Error incrementing view count: {ex.Message}"
                };
            }
        }

        // 评论相关方法
        public async Task<ServiceResponse<List<BlogCommentDto>>> GetCommentsByPostIdAsync(Guid postId)
        {
            try
            {
                var comments = await _context.BlogComments
                    .Include(c => c.User)
                    .Include(c => c.Replies.Where(r => r.IsApproved))
                        .ThenInclude(r => r.User)
                    .Where(c => c.BlogPostId == postId && c.IsApproved && c.ParentCommentId == null)
                    .OrderBy(c => c.CreatedAt)
                    .ToListAsync();

                var commentDtos = MapToBlogCommentDtos(comments);

                return new ServiceResponse<List<BlogCommentDto>>
                {
                    Success = true,
                    Data = commentDtos.ToList()
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<List<BlogCommentDto>>
                {
                    Success = false,
                    Error = $"Error retrieving comments: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<BlogCommentDto>> CreateCommentAsync(BlogCommentCreateDto createDto, Guid userId)
        {
            try
            {
                var comment = new BlogComment
                {
                    Id = Guid.NewGuid(),
                    Content = createDto.Content,
                    BlogPostId = createDto.BlogPostId,
                    UserId = userId,
                    ParentCommentId = createDto.ParentCommentId,
                    IsApproved = false, // 需要审核
                    CreatedAt = DateTime.UtcNow
                };

                _context.BlogComments.Add(comment);
                await _context.SaveChangesAsync();

                var createdComment = await _context.BlogComments
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.Id == comment.Id);

                var commentDto = MapToBlogCommentDto(createdComment!);

                return new ServiceResponse<BlogCommentDto>
                {
                    Success = true,
                    Data = commentDto,
                    Error = "Comment created successfully and pending approval"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogCommentDto>
                {
                    Success = false,
                    Error = $"Error creating comment: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> DeleteCommentAsync(Guid commentId, Guid userId)
        {
            try
            {
                var comment = await _context.BlogComments.FirstOrDefaultAsync(c => c.Id == commentId);
                if (comment == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Comment not found"
                    };
                }

                // 只有评论作者可以删除
                if (comment.UserId != userId)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Unauthorized to delete this comment"
                    };
                }

                _context.BlogComments.Remove(comment);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Error = "Comment deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"Error deleting comment: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> ApproveCommentAsync(Guid commentId, Guid userId)
        {
            try
            {
                var comment = await _context.BlogComments
                    .Include(c => c.BlogPost)
                    .FirstOrDefaultAsync(c => c.Id == commentId);

                if (comment == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Comment not found"
                    };
                }

                // 只有博客作者可以审核评论
                if (comment.BlogPost.AuthorId != userId)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Unauthorized to approve this comment"
                    };
                }

                comment.IsApproved = true;
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Error = "Comment approved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"Error approving comment: {ex.Message}"
                };
            }
        }

        // 分类相关方法
        public async Task<ServiceResponse<List<BlogCategoryDto>>> GetAllCategoriesAsync()
        {
            try
            {
                var categories = await _context.BlogCategories.ToListAsync();
                var categoryDtos = _mapper.Map<List<BlogCategoryDto>>(categories);

                // 计算每个分类的文章数量
                foreach (var categoryDto in categoryDtos)
                {
                    categoryDto.PostCount = await _context.BlogPosts
                        .CountAsync(p => p.Category == categoryDto.Name && p.IsPublished);
                }

                return new ServiceResponse<List<BlogCategoryDto>>
                {
                    Success = true,
                    Data = categoryDtos
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<List<BlogCategoryDto>>
                {
                    Success = false,
                    Error = $"Error retrieving categories: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<BlogCategoryDto>> CreateCategoryAsync(BlogCategoryCreateDto createDto)
        {
            try
            {
                var category = new BlogCategory
                {
                    Id = Guid.NewGuid(),
                    Name = createDto.Name,
                    Slug = string.IsNullOrEmpty(createDto.Slug) ? GenerateSlug(createDto.Name) : createDto.Slug,
                    Description = createDto.Description,
                    Color = createDto.Color,
                    CreatedAt = DateTime.UtcNow
                };

                _context.BlogCategories.Add(category);
                await _context.SaveChangesAsync();

                var categoryDto = _mapper.Map<BlogCategoryDto>(category);
                categoryDto.PostCount = 0;

                return new ServiceResponse<BlogCategoryDto>
                {
                    Success = true,
                    Data = categoryDto,
                    Error = "Category created successfully"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogCategoryDto>
                {
                    Success = false,
                    Error = $"Error creating category: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> DeleteCategoryAsync(Guid id)
        {
            try
            {
                var category = await _context.BlogCategories.FirstOrDefaultAsync(c => c.Id == id);
                if (category == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "Category not found"
                    };
                }

                _context.BlogCategories.Remove(category);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Error = "Category deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"Error deleting category: {ex.Message}"
                };
            }
        }

        // 统计相关方法
        public async Task<ServiceResponse<BlogStatsDto>> GetBlogStatsAsync()
        {
            try
            {
                var stats = new BlogStatsDto
                {
                    TotalPosts = await _context.BlogPosts.CountAsync(),
                    PublishedPosts = await _context.BlogPosts.CountAsync(p => p.IsPublished),
                    DraftPosts = await _context.BlogPosts.CountAsync(p => !p.IsPublished),
                    TotalComments = await _context.BlogComments.CountAsync(c => c.IsApproved),
                    TotalViews = await _context.BlogPosts.SumAsync(p => p.ViewCount)
                };

                // 热门分类
                var categoriesResponse = await GetAllCategoriesAsync();
                if (categoriesResponse.Success && categoriesResponse.Data != null)
                {
                    stats.PopularCategories = categoriesResponse.Data
                        .OrderByDescending(c => c.PostCount)
                        .Take(5)
                        .ToList();
                }

                // 热门标签
                var tagsResponse = await GetPopularTagsAsync(10);
                if (tagsResponse.Success && tagsResponse.Data != null)
                {
                    stats.PopularTags = tagsResponse.Data;
                }

                return new ServiceResponse<BlogStatsDto>
                {
                    Success = true,
                    Data = stats
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<BlogStatsDto>
                {
                    Success = false,
                    Error = $"Error retrieving blog stats: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<List<string>>> GetPopularTagsAsync(int limit = 20)
        {
            try
            {
                var posts = await _context.BlogPosts
                    .Where(p => p.IsPublished && !string.IsNullOrEmpty(p.Tags))
                    .Select(p => p.Tags)
                    .ToListAsync();

                var tagCounts = new Dictionary<string, int>();
                foreach (var tagString in posts)
                {
                    var tags = tagString.Split(',', StringSplitOptions.RemoveEmptyEntries);
                    foreach (var tag in tags)
                    {
                        var trimmedTag = tag.Trim();
                        if (!string.IsNullOrEmpty(trimmedTag))
                        {
                            tagCounts[trimmedTag] = tagCounts.GetValueOrDefault(trimmedTag, 0) + 1;
                        }
                    }
                }

                var popularTags = tagCounts
                    .OrderByDescending(kvp => kvp.Value)
                    .Take(limit)
                    .Select(kvp => kvp.Key)
                    .ToList();

                return new ServiceResponse<List<string>>
                {
                    Success = true,
                    Data = popularTags
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<List<string>>
                {
                    Success = false,
                    Error = $"Error retrieving popular tags: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<List<BlogPostDto>>> GetRecentPostsAsync(int limit = 5)
        {
            try
            {
                var posts = await _context.BlogPosts
                    .Include(p => p.Author)
                    .Where(p => p.IsPublished)
                    .OrderByDescending(p => p.PublishedAt)
                    .Take(limit)
                    .ToListAsync();

                var postDtos = posts.Select(p => MapToBlogPostDto(p)).ToList();

                return new ServiceResponse<List<BlogPostDto>>
                {
                    Success = true,
                    Data = postDtos
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<List<BlogPostDto>>
                {
                    Success = false,
                    Error = $"Error retrieving recent posts: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<List<BlogPostDto>>> GetRelatedPostsAsync(Guid postId, int limit = 3)
        {
            try
            {
                var currentPost = await _context.BlogPosts.FirstOrDefaultAsync(p => p.Id == postId);
                if (currentPost == null)
                {
                    return new ServiceResponse<List<BlogPostDto>>
                    {
                        Success = false,
                        Error = "Post not found"
                    };
                }

                var relatedPosts = await _context.BlogPosts
                    .Include(p => p.Author)
                    .Where(p => p.Id != postId && p.IsPublished && 
                               (p.Category == currentPost.Category || 
                                p.Tags.Contains(currentPost.Tags)))
                    .OrderByDescending(p => p.ViewCount)
                    .Take(limit)
                    .ToListAsync();

                var postDtos = relatedPosts.Select(p => MapToBlogPostDto(p)).ToList();

                return new ServiceResponse<List<BlogPostDto>>
                {
                    Success = true,
                    Data = postDtos
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<List<BlogPostDto>>
                {
                    Success = false,
                    Error = $"Error retrieving related posts: {ex.Message}"
                };
            }
        }

        // 辅助方法
        private string GenerateSlug(string title)
        {
            if (string.IsNullOrEmpty(title))
                return string.Empty;

            // 转换为小写并替换空格为连字符
            var slug = title.ToLower().Trim();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", ""); // 移除特殊字符
            slug = Regex.Replace(slug, @"\s+", "-"); // 替换空格为连字符
            slug = Regex.Replace(slug, @"-+", "-"); // 合并多个连字符

            return slug;
        }

        private BlogPostDto MapToBlogPostDto(BlogPost post)
        {
            return new BlogPostDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                Summary = post.Summary,
                FeaturedImage = post.FeaturedImage,
                Slug = post.Slug,
                IsPublished = post.IsPublished,
                PublishedAt = post.PublishedAt,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                AuthorId = post.AuthorId,
                AuthorName = $"{post.Author?.FirstName} {post.Author?.LastName}".Trim(),
                AuthorAvatar = post.Author?.Avatar ?? "",
                ViewCount = post.ViewCount,
                Tags = string.IsNullOrEmpty(post.Tags) ? new List<string>() : 
                       post.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim()).ToList(),
                Category = post.Category,
                MetaDescription = post.MetaDescription,
                MetaKeywords = post.MetaKeywords,
                CommentCount = post.Comments?.Count(c => c.IsApproved) ?? 0
            };
        }

        private BlogCommentDto MapToBlogCommentDto(BlogComment comment)
        {
            return new BlogCommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                BlogPostId = comment.BlogPostId,
                UserId = comment.UserId,
                UserName = $"{comment.User?.FirstName} {comment.User?.LastName}".Trim(),
                UserAvatar = comment.User?.Avatar ?? "",
                ParentCommentId = comment.ParentCommentId,
                IsApproved = comment.IsApproved,
                CreatedAt = comment.CreatedAt,
                Replies = comment.Replies?.Where(r => r.IsApproved).Select(r => MapToBlogCommentDto(r)).ToList() ?? new List<BlogCommentDto>()
            };
        }

        private IEnumerable<BlogCommentDto> MapToBlogCommentDtos(IEnumerable<BlogComment> comments)
        {
            return comments.Select(c => MapToBlogCommentDto(c));
        }
    }
} 