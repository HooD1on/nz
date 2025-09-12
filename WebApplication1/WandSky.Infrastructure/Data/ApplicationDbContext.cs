// WandSky.Infrastructure/Data/ApplicationDbContext.cs - 添加Payment和Booking支持
using Microsoft.EntityFrameworkCore;
using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // 现有的DbSet (保持不变)
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;
        public DbSet<Wishlist> Wishlists { get; set; } = null!;
        public DbSet<BlogPost> BlogPosts { get; set; } = null!;
        public DbSet<BlogComment> BlogComments { get; set; } = null!;

        public DbSet<BlogCategory> BlogCategories { get; set; } = null!;

        // 添加缺失的用户相关 DbSet  
        public DbSet<UserPreferences> UserPreferences { get; set; } = null!;
        public DbSet<UserTravelPreference> UserTravelPreferences { get; set; } = null!;

        // 新增的Stripe支付相关DbSet
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<Booking> Bookings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // 现有的实体配置 (保持不变)
            ConfigureUserEntity(modelBuilder);
            ConfigureReviewEntity(modelBuilder);
            ConfigureWishlistEntity(modelBuilder);
            ConfigureBlogEntity(modelBuilder);
            ConfigureUserRelatedEntities(modelBuilder);

            // 新增的支付相关实体配置
            ConfigurePaymentEntity(modelBuilder);
            ConfigureBookingEntity(modelBuilder);
        }

        private void ConfigureUserEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                // 移除 Username 相关配置，因为 User 实体中没有这个属性
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
            });
        }

        private void ConfigureReviewEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Rating).IsRequired();
                entity.Property(e => e.Content).HasMaxLength(1000);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private void ConfigureWishlistEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Wishlist>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DestinationId).IsRequired();
                entity.Property(e => e.DestinationTitle).IsRequired().HasMaxLength(200);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private void ConfigureBlogEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BlogPost>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Slug).IsRequired().HasMaxLength(250);
                entity.HasIndex(e => e.Slug).IsUnique();

                entity.HasOne(e => e.Author)
                    .WithMany()
                    .HasForeignKey(e => e.AuthorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<BlogCategory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Slug).IsRequired().HasMaxLength(120);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Color).IsRequired().HasMaxLength(20);
                entity.HasIndex(e => e.Slug).IsUnique();
            });

            modelBuilder.Entity<BlogComment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);

                entity.HasOne(e => e.BlogPost)
                    .WithMany(b => b.Comments)
                    .HasForeignKey(e => e.BlogPostId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        // 新增的支付实体配置
        private void ConfigurePaymentEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);

                // 基本属性
                entity.Property(e => e.StripePaymentIntentId)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Amount)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");

                entity.Property(e => e.Currency)
                    .IsRequired()
                    .HasMaxLength(3)
                    .HasDefaultValue("nzd");

                entity.Property(e => e.PackageId)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.FailureReason)
                    .HasMaxLength(500);

                entity.Property(e => e.Metadata)
                    .HasColumnType("nvarchar(max)");

                // 时间戳
                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // 外键关系
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                // 索引
                entity.HasIndex(e => e.StripePaymentIntentId).IsUnique();
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.Status);
            });
        }


        private void ConfigureUserRelatedEntities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserPreferences>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Preferences)
                    .HasForeignKey<UserPreferences>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<UserTravelPreference>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Preference).IsRequired();
                entity.HasOne(e => e.User)
                    .WithMany(u => u.TravelPreferences)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private void ConfigureBookingEntity(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.HasKey(e => e.Id);

                // 基本属性
                entity.Property(e => e.PackageId)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.TotalAmount)
                    .IsRequired()
                    .HasColumnType("decimal(18,2)");

                entity.Property(e => e.Currency)
                    .IsRequired()
                    .HasMaxLength(3)
                    .HasDefaultValue("nzd");

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.Phone)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.BookingReference)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasConversion<string>();

                entity.Property(e => e.SpecialRequests)
                    .HasMaxLength(1000);

                entity.Property(e => e.CancellationReason)
                    .HasMaxLength(500);

                // 时间戳
                entity.Property(e => e.CreatedAt)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");

                // 外键关系
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Payment)
                    .WithMany(p => p.Bookings)
                    .HasForeignKey(e => e.PaymentId)
                    .OnDelete(DeleteBehavior.Restrict);

                // 索引
                entity.HasIndex(e => e.BookingReference).IsUnique();
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.PaymentId);
                entity.HasIndex(e => e.Status);
            });
        }
    }
}