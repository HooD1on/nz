using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data.Config
{
    // WandSky.Infrastructure/Data/Config/ReviewConfiguration.cs
    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Content)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(r => r.Rating)
                .IsRequired();

            builder.Property(r => r.GuestName)
                .HasMaxLength(100);

            builder.Property(r => r.GuestEmail)
                .HasMaxLength(100);

            // 修改为正确的外键关系配置
            builder.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .IsRequired(false) // 设置为不必需，允许游客评论
                .OnDelete(DeleteBehavior.SetNull); // 当用户被删除时，评论保留但UserId置为null
        }
    }


    public class ReviewImageConfiguration : IEntityTypeConfiguration<ReviewImage>
    {
        public void Configure(EntityTypeBuilder<ReviewImage> builder)
        {
            builder.HasKey(i => i.Id);

            builder.Property(i => i.ImageUrl)
                .IsRequired()
                .HasMaxLength(500);

            builder.HasOne(i => i.Review)
                .WithMany(r => r.Images)
                .HasForeignKey(i => i.ReviewId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}