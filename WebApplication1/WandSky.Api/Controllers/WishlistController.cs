using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WandSky.Core.DTOs;
using WandSky.Core.Interfaces.Services;

namespace WandSky.Api.Controllers
{
    [ApiController]
    [Route("api/wishlist")]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpPost]
        public async Task<ActionResult> AddToWishlist([FromBody] AddToWishlistDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _wishlistService.AddToWishlistAsync(userId.Value, dto);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new { success = true, message = "添加收藏成功" });
        }

        [HttpDelete("{destinationId}")]
        public async Task<ActionResult> RemoveFromWishlist(string destinationId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _wishlistService.RemoveFromWishlistAsync(userId.Value, destinationId);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new { success = true, message = "移除收藏成功" });
        }

        [HttpGet]
        public async Task<ActionResult<WishlistResponseDto>> GetWishlist([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _wishlistService.GetUserWishlistAsync(userId.Value, page, pageSize);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(result.Data);
        }

        [HttpGet("check/{destinationId}")]
        public async Task<ActionResult> CheckWishlistStatus(string destinationId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _wishlistService.IsInWishlistAsync(userId.Value, destinationId);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new { isInWishlist = result.Data });
        }

        [HttpPut("{wishlistItemId}/notes")]
        public async Task<ActionResult> UpdateNotes(Guid wishlistItemId, [FromBody] UpdateWishlistNotesDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _wishlistService.UpdateNotesAsync(userId.Value, wishlistItemId, dto.Notes);

            if (!result.Success)
                return BadRequest(new { error = result.Error });

            return Ok(new { success = true, message = "更新备注成功" });
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return null;
            return userId;
        }
    }
}