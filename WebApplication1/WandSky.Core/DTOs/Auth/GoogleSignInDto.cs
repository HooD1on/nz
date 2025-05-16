using WandSky.Core.DTOs.Auth;


namespace WandSky.Core.DTOs.Auth
{
    public class GoogleSignInDto
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Avatar { get; set; }
    }
}
