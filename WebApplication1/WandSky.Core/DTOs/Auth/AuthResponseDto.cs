namespace WandSky.Core.DTOs.Auth
{
    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public UserDto User { get; set; }
        public string Error { get; set; }
    }
}
