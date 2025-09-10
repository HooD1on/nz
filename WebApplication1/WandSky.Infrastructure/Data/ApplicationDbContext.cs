using Microsoft.EntityFrameworkCore;
using WandSky.Core.Entities;
using WandSky.Infrastructure.Data.Config;

namespace WandSky.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserPreferences> UserPreferences { get; set; }
        public DbSet<UserTravelPreference> UserTravelPreferences { get; set; }

        public DbSet<Review> Reviews { get; set; }
        public DbSet<ReviewImage> ReviewImages { get; set; }

        public DbSet<Wishlist> Wishlists { get; set; }

        // 新增博客相关DbSet
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<BlogComment> BlogComments { get; set; }
        public DbSet<BlogCategory> BlogCategories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
            modelBuilder.ApplyConfiguration(new WishlistConfiguration());
            
            // 应用博客相关配置
            modelBuilder.ApplyConfiguration(new BlogPostConfiguration());
            modelBuilder.ApplyConfiguration(new BlogCommentConfiguration());
            modelBuilder.ApplyConfiguration(new BlogCategoryConfiguration());
            modelBuilder.ApplyConfiguration(new PaymentConfiguration());
            modelBuilder.ApplyConfiguration(new BookingConfiguration());
        }
    }
}
