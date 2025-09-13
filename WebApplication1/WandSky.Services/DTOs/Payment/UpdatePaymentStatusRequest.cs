using System.ComponentModel.DataAnnotations;

namespace WandSky.Services.DTOs.Payment
{
    public class UpdatePaymentStatusRequest
    {
        [Required(ErrorMessage = "PaymentIntentId 是必需的")]
        public string PaymentIntentId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Status 是必需的")]
        [RegularExpression("^(succeeded|failed|canceled)$", ErrorMessage = "Status 必须是 succeeded、failed 或 canceled")]
        public string Status { get; set; } = string.Empty;
    }
}
