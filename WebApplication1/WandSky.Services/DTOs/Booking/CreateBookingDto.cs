using WandSky.Core.Entities;


namespace WandSky.Services.DTOs.Booking
{
    public class CreateBookingDto
    {
        public Guid UserId { get; set; }
        public Guid PaymentId { get; set; }
        public string PackageId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int Travelers { get; set; }
        public DateTime TravelDate { get; set; }
        public decimal TotalAmount { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Confirmed;
        public string? SpecialRequests { get; set; }
    }

    public class BookingResponseDto
    {
        public Guid Id { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public Guid PaymentId { get; set; }
        public string PackageId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int Travelers { get; set; }
        public DateTime TravelDate { get; set; }
        public decimal TotalAmount { get; set; }
        public BookingStatus Status { get; set; }
        public string? SpecialRequests { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}