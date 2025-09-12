// WandSky.Services/DTOs/Payment/CreatePaymentIntentRequest.cs
using System.ComponentModel.DataAnnotations;

namespace WandSky.Services.DTOs.Payment
{
    public class CreatePaymentIntentRequest
    {
        [Required(ErrorMessage = "套餐ID不能为空")]
        public string PackageId { get; set; } = string.Empty;

        [Required(ErrorMessage = "金额不能为空")]
        [Range(0.01, double.MaxValue, ErrorMessage = "金额必须大于0")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "货币类型不能为空")]
        public string Currency { get; set; } = "nzd";

        [Required(ErrorMessage = "预订信息不能为空")]
        public BookingDataDto BookingData { get; set; } = new();
    }

    public class BookingDataDto
    {
        [Required(ErrorMessage = "客户姓名不能为空")]
        public string CustomerName { get; set; } = string.Empty;

        [Required(ErrorMessage = "邮箱地址不能为空")]
        [EmailAddress(ErrorMessage = "邮箱格式不正确")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "电话号码不能为空")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "出行日期不能为空")]
        public DateTime TravelDate { get; set; }

        [Required(ErrorMessage = "旅客人数不能为空")]
        [Range(1, int.MaxValue, ErrorMessage = "旅客人数必须大于0")]
        public int Travelers { get; set; }

        public string? SpecialRequests { get; set; }
    }

    public class PaymentIntentResponse
    {
        public string ClientSecret { get; set; } = string.Empty;
        public string PaymentIntentId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
    }

    public class PaymentStatusResponse
    {
        public string PaymentIntentId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public DateTime? PaidAt { get; set; }
        public string? FailureReason { get; set; }
        public BookingInfo? Booking { get; set; }
    }

    public class BookingInfo
    {
        public string Id { get; set; } = string.Empty;
        public string PackageId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime TravelDate { get; set; }
        public int Travelers { get; set; }
        public string BookingReference { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}