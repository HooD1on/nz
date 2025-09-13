using System.ComponentModel.DataAnnotations;
using WandSky.Services.DTOs.Booking;

namespace WandSky.Services.DTOs.Booking
{
    public class CreateBookingRequest
    {
        [Required(ErrorMessage = "PaymentIntentId 是必需的")]
        public string PaymentIntentId { get; set; } = string.Empty;

        [Required(ErrorMessage = "PackageId 是必需的")]
        public string PackageId { get; set; } = string.Empty;

        [Required(ErrorMessage = "BookingData 是必需的")]
        public BookingFormData BookingData { get; set; } = new();

        [Required(ErrorMessage = "TotalAmount 是必需的")]
        [Range(0.01, double.MaxValue, ErrorMessage = "TotalAmount 必须大于 0")]
        public decimal TotalAmount { get; set; }
    }

    public class BookingFormData
    {
        [Required(ErrorMessage = "客户姓名是必需的")]
        public string CustomerName { get; set; } = string.Empty;

        [Required(ErrorMessage = "邮箱是必需的")]
        [EmailAddress(ErrorMessage = "邮箱格式无效")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "电话是必需的")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "旅行人数是必需的")]
        [Range(1, 20, ErrorMessage = "旅行人数必须在 1-20 之间")]
        public int Travelers { get; set; }

        [Required(ErrorMessage = "旅行日期是必需的")]
        public DateTime TravelDate { get; set; }

        public string? SpecialRequests { get; set; }
    }
}