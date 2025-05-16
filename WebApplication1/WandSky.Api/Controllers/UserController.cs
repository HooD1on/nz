using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using WandSky.Core.DTOs;
using WandSky.Core.DTOs.Auth;
using WandSky.Core.Interfaces.Services;

namespace WandSky.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            // 从令牌中获取用户ID
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var profile = await _userService.GetUserProfileAsync(Guid.Parse(userId));
            if (profile == null)
            {
                return NotFound();
            }

            return Ok(profile);
        }

        [HttpPatch("profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile(UpdateProfileDto updateProfileDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var updatedProfile = await _userService.UpdateProfileAsync(Guid.Parse(userId), updateProfileDto);
                return Ok(updatedProfile);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "更新个人资料时发生错误" });
            }
        }

        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto passwordDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _userService.ChangePasswordAsync(
                Guid.Parse(userId),
                passwordDto.CurrentPassword,
                passwordDto.NewPassword
            );

            if (!result.Success)
            {
                return BadRequest(new { error = result.Error });
            }

            return Ok(new { message = "Password changed successfully" });
        }

        [HttpPatch("preferences")]
        public async Task<ActionResult<UserPreferencesDto>> UpdatePreferences(UpdatePreferencesDto preferencesDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var updatedPreferences = await _userService.UpdatePreferencesAsync(
                Guid.Parse(userId),
                preferencesDto
            );

            return Ok(updatedPreferences);
        }

        [HttpPost("request-reset-password")]
        [AllowAnonymous] // 这个端点不需要认证
        public async Task<ActionResult> RequestPasswordReset([FromBody] RequestResetPasswordDto request)
        {
            var result = await _userService.RequestPasswordResetAsync(request.Email);
            return Ok(result); // 总是返回成功，不暴露用户是否存在
        }

        [HttpPost("reset-password")]
        [AllowAnonymous] // 这个端点不需要认证
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            var result = await _userService.ResetPasswordWithTokenAsync(
                request.Token,
                request.NewPassword
            );

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("google")]
        [AllowAnonymous]
        public async Task<IActionResult> SyncGoogleUser([FromBody] GoogleUserDto user)
        {
            await _userService.SyncGoogleUserAsync(user);
            return Ok(new { message = "Google user synced" });
        }

    }
}