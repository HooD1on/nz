namespace WandSky.Core.Entities
{
    public class Booking : BaseEntity
    {
        public Guid UserId { get; set; }
        public string PackageId { get; set; } = string.Empty;
        public Guid PaymentId { get; set; }
        public BookingStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "nzd";
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime TravelDate { get; set; }
        public int Travelers { get; set; }
        public string? SpecialRequests { get; set; }
        public DateTime? ConfirmedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string? CancellationReason { get; set; }
        public string BookingReference { get; set; } = string.Empty;

        // Navigation properties
        public User User { get; set; } = null!;
        public Payment Payment { get; set; } = null!;
    }

    public enum BookingStatus
    {
        Pending = 0,
        Confirmed = 1,
        InProgress = 2,
        Completed = 3,
        Cancelled = 4,
        Refunded = 5
    }
}