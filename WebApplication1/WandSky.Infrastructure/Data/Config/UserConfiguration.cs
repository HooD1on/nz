using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Data.Config
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(100);

            builder.HasIndex(u => u.Email)
                .IsUnique();

            builder.Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.PasswordHash)
                .IsRequired();

            builder.Property(u => u.PasswordSalt)
                .IsRequired();

            // 允许以下字段为空
            builder.Property(u => u.Phone)
                .IsRequired(false);

            builder.Property(u => u.Address)
                .IsRequired(false);

            builder.Property(u => u.City)
                .IsRequired(false);

            builder.Property(u => u.Country)
                .IsRequired(false);

            builder.Property(u => u.Bio)
                .IsRequired(false);

            builder.Property(u => u.ProfileImage)
                .IsRequired(false);

            builder.Property(u => u.PasswordResetToken)
                .IsRequired(false)
                .HasMaxLength(100);

            builder.Property(u => u.PasswordResetTokenExpires)
                .IsRequired(false);

            builder.Property(u => u.LoginFailedCount)
                .HasDefaultValue(0);

            builder.Property(u => u.LastLoginFailedAt)
                .IsRequired(false);

            builder.Property(u => u.LockoutEndAt)
                .IsRequired(false);
        }
    }
}
