using WandSky.Core.Entities;
using WandSky.Core.Entitiies;

namespace WandSky.Core.Entities
{
    public class Payment : BaseEntity
    {
        public Guid UserId { get; set; }
        public string StripePaymentIntentId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "nzd";
        public PaymentStatus Status { get; set; }
        public string PackageId { get; set; } = string.Empty;
        public DateTime? PaidAt { get; set; }
        public string? FailureReason { get; set; }
        public string? Metadata { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public List<Booking> Bookings { get; set; } = new();
    }

    public enum PaymentStatus
    {
        Pending = 0,
        Succeeded = 1,
        Failed = 2,
        Canceled = 3,
        Refunded = 4
    }
}