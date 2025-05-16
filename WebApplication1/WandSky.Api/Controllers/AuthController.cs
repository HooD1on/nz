using Microsoft.AspNetCore.Mvc;
using WandSky.Core.DTOs;
using WandSky.Core.DTOs.Auth;
using WandSky.Core.Interfaces.Services;

namespace WandSky.API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(UserRegisterDto registerDto)
    {
        var response = await _authService.RegisterAsync(registerDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(UserLoginDto loginDto)
    {
        var response = await _authService.LoginAsync(loginDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("google")]
    public async Task<ActionResult<AuthResponseDto>> GoogleSignInAsync([FromBody] GoogleSignInDto request)
    {
        try
        {
            if (request == null)
            {
                Console.WriteLine("Google signin request is null");
                return BadRequest("Request cannot be null");
            }

            // 记录详细请求
            Console.WriteLine($"Google signin request: Email={request.Email}, FirstName={request.FirstName}, LastName={request.LastName}");

            var response = await _authService.GoogleSignInAsync(request);

            if (!response.Success)
            {
                Console.WriteLine($"Google signin failed: {response.Error}");
                return BadRequest(response);
            }

            Console.WriteLine($"Google signin successful for: {request.Email}");
            return Ok(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception in GoogleSignInAsync: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            return StatusCode(500, new AuthResponseDto
            {
                Success = false,
                Error = $"Internal server error: {ex.Message}"
            });
        }
    }
}