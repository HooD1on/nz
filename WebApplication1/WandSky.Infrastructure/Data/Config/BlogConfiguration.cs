using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data.Config
{
    public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
    {
        public void Configure(EntityTypeBuilder<BlogPost> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(p => p.Content)
                .IsRequired();

            builder.Property(p => p.Summary)
                .HasMaxLength(500);

            builder.Property(p => p.Slug)
                .IsRequired()
                .HasMaxLength(250);

            builder.HasIndex(p => p.Slug)
                .IsUnique();

            builder.Property(p => p.FeaturedImage)
                .HasMaxLength(500);

            builder.Property(p => p.Tags)
                .HasMaxLength(1000);

            builder.Property(p => p.Category)
                .HasMaxLength(100);

            builder.Property(p => p.MetaDescription)
                .HasMaxLength(160);

            builder.Property(p => p.MetaKeywords)
                .HasMaxLength(500);

            // 关系配置
            builder.HasOne(p => p.Author)
                .WithMany()
                .HasForeignKey(p => p.AuthorId)
                .OnDelete(DeleteBehavior.Restrict); // 修改为Restrict避免循环删除

            builder.HasMany(p => p.Comments)
                .WithOne(c => c.BlogPost)
                .HasForeignKey(c => c.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);

            // 索引
            builder.HasIndex(p => p.IsPublished);
            builder.HasIndex(p => p.PublishedAt);
            builder.HasIndex(p => p.CreatedAt);
            builder.HasIndex(p => p.Category);
            builder.HasIndex(p => p.AuthorId);
        }
    }

    public class BlogCommentConfiguration : IEntityTypeConfiguration<BlogComment>
    {
        public void Configure(EntityTypeBuilder<BlogComment> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Content)
                .IsRequired()
                .HasMaxLength(2000);

            // 关系配置
            builder.HasOne(c => c.BlogPost)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict); // 修改为Restrict避免循环删除

            // 自引用关系 - 回复功能
            builder.HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);

            // 索引
            builder.HasIndex(c => c.BlogPostId);
            builder.HasIndex(c => c.UserId);
            builder.HasIndex(c => c.ParentCommentId);
            builder.HasIndex(c => c.IsApproved);
            builder.HasIndex(c => c.CreatedAt);
        }
    }

    public class BlogCategoryConfiguration : IEntityTypeConfiguration<BlogCategory>
    {
        public void Configure(EntityTypeBuilder<BlogCategory> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.Slug)
                .IsRequired()
                .HasMaxLength(120);

            builder.HasIndex(c => c.Slug)
                .IsUnique();

            builder.Property(c => c.Description)
                .HasMaxLength(500);

            builder.Property(c => c.Color)
                .HasMaxLength(20);

            // 索引
            builder.HasIndex(c => c.Name);
        }
    }
} 