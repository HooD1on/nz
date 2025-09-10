using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data.Config
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.StripePaymentIntentId)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");

            builder.Property(p => p.Currency)
                .IsRequired()
                .HasMaxLength(3);

            builder.Property(p => p.PackageId)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(p => p.FailureReason)
                .HasMaxLength(500);

            builder.Property(p => p.Metadata)
                .HasMaxLength(2000);

            builder.HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(p => p.StripePaymentIntentId)
                .IsUnique();

            builder.HasIndex(p => p.UserId);
            builder.HasIndex(p => p.Status);
        }
    }
}