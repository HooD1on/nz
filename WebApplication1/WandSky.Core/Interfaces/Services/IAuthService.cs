using WandSky.Core.DTOs;
using WandSky.Core.DTOs.Auth;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(UserRegisterDto registerDto);
    Task<AuthResponseDto> LoginAsync(UserLoginDto loginDto);
    Task<AuthResponseDto> GoogleSignInAsync(GoogleSignInDto request);
}