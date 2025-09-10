using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data.Config
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.PackageId)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(b => b.TotalAmount)
                .HasColumnType("decimal(18,2)");

            builder.Property(b => b.Currency)
                .IsRequired()
                .HasMaxLength(3);

            builder.Property(b => b.CustomerName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(b => b.Email)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(b => b.Phone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(b => b.SpecialRequests)
                .HasMaxLength(1000);

            builder.Property(b => b.CancellationReason)
                .HasMaxLength(500);

            builder.Property(b => b.BookingReference)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(b => b.Payment)
                .WithMany(p => p.Bookings)
                .HasForeignKey(b => b.PaymentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(b => b.UserId);
            builder.HasIndex(b => b.Status);
            builder.HasIndex(b => b.BookingReference).IsUnique();
        }
    }
}
