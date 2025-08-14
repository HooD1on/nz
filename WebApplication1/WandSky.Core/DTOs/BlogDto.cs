namespace WandSky.Core.DTOs
{
    public class BlogPostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string FeaturedImage { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid AuthorId { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string AuthorAvatar { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string Category { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string MetaKeywords { get; set; } = string.Empty;
        public int CommentCount { get; set; }
        public List<BlogCommentDto> Comments { get; set; } = new List<BlogCommentDto>();
    }

    public class BlogPostCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string FeaturedImage { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsPublished { get; set; } = false;
        public List<string> Tags { get; set; } = new List<string>();
        public string Category { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string MetaKeywords { get; set; } = string.Empty;
    }

    public class BlogPostUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string FeaturedImage { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public List<string> Tags { get; set; } = new List<string>();
        public string Category { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string MetaKeywords { get; set; } = string.Empty;
    }

    public class BlogCommentDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid BlogPostId { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserAvatar { get; set; } = string.Empty;
        public Guid? ParentCommentId { get; set; }
        public bool IsApproved { get; set; }
        public DateTime? CreatedAt { get; set; }
        public List<BlogCommentDto> Replies { get; set; } = new List<BlogCommentDto>();
    }

    public class BlogCommentCreateDto
    {
        public string Content { get; set; } = string.Empty;
        public Guid BlogPostId { get; set; }
        public Guid? ParentCommentId { get; set; }
    }

    public class BlogCategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int PostCount { get; set; }
    }

    public class BlogCategoryCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }

    public class BlogSearchDto
    {
        public string? Keyword { get; set; }
        public string? Category { get; set; }
        public string? Tag { get; set; }
        public Guid? AuthorId { get; set; }
        public bool? IsPublished { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
    }

    public class BlogStatsDto
    {
        public int TotalPosts { get; set; }
        public int PublishedPosts { get; set; }
        public int DraftPosts { get; set; }
        public int TotalComments { get; set; }
        public int TotalViews { get; set; }
        public List<BlogCategoryDto> PopularCategories { get; set; } = new List<BlogCategoryDto>();
        public List<string> PopularTags { get; set; } = new List<string>();
    }
} 