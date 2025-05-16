using System.ComponentModel.DataAnnotations;

namespace WandSky.Core.DTOs.Auth
{
    public class RequestResetPasswordDto
    {
        [Required(ErrorMessage = "邮箱是必需的")]
        [EmailAddress(ErrorMessage = "请输入有效的邮箱地址")]
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "重置令牌是必需的")]
        public string Token { get; set; }

        [Required(ErrorMessage = "新密码是必需的")]
        [MinLength(8, ErrorMessage = "密码至少需要8个字符")]
        public string NewPassword { get; set; }
    }
}