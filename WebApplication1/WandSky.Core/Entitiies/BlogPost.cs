using WandSky.Core.Entities;

namespace WandSky.Core.Entities
{
    public class BlogPost : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string FeaturedImage { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsPublished { get; set; } = false;
        public DateTime? PublishedAt { get; set; }
        public Guid AuthorId { get; set; }
        public int ViewCount { get; set; } = 0;
        public string Tags { get; set; } = string.Empty; // 用逗号分隔的标签
        public string Category { get; set; } = string.Empty;
        public string MetaDescription { get; set; } = string.Empty;
        public string MetaKeywords { get; set; } = string.Empty;

        // 导航属性
        public User Author { get; set; }
        public List<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }

    public class BlogComment : BaseEntity
    {
        public string Content { get; set; } = string.Empty;
        public Guid BlogPostId { get; set; }
        public Guid UserId { get; set; }
        public Guid? ParentCommentId { get; set; } // 用于回复功能
        public bool IsApproved { get; set; } = false;

        // 导航属性
        public BlogPost BlogPost { get; set; }
        public User User { get; set; }
        public BlogComment? ParentComment { get; set; }
        public List<BlogComment> Replies { get; set; } = new List<BlogComment>();
    }

    public class BlogCategory : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty; // 用于UI显示的颜色
    }
} 