using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data.Config
{
    public class WishlistConfiguration : IEntityTypeConfiguration<Wishlist>
    {
        public void Configure(EntityTypeBuilder<Wishlist> builder)
        {
            builder.HasKey(w => w.Id);

            builder.Property(w => w.DestinationId).IsRequired().HasMaxLength(50);
            builder.Property(w => w.DestinationTitle).IsRequired().HasMaxLength(200);
            builder.Property(w => w.DestinationImage).HasMaxLength(500);
            builder.Property(w => w.DestinationLocation).HasMaxLength(200);
            builder.Property(w => w.Notes).HasMaxLength(500);
            builder.Property(w => w.DestinationPrice).HasColumnType("decimal(18,2)");
            builder.Property(w => w.DestinationRating).HasColumnType("float");

            builder.HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(w => new { w.UserId, w.DestinationId })
                .IsUnique()
                .HasDatabaseName("IX_Wishlist_User_Destination");

            builder.HasIndex(w => w.UserId)
                .HasDatabaseName("IX_Wishlist_UserId");
        }
    }
}