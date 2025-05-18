using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using WandSky.Core.DTOs;
using WandSky.Core.Interfaces.Services;

namespace WandSky.Api.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("destination/{destinationId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetDestinationReviews(Guid destinationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var reviews = await _reviewService.GetDestinationReviewsAsync(destinationId, page, pageSize);
            return Ok(reviews);
        }

        [HttpGet("destination/{destinationId}/statistics")]
        public async Task<ActionResult<ReviewStatisticsDto>> GetDestinationReviewStatistics(Guid destinationId)
        {
            var statistics = await _reviewService.GetDestinationReviewStatisticsAsync(destinationId);
            return Ok(statistics);
        }

        [HttpPost]
        public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            Guid? userId = null;

            // 如果用户已登录，获取用户ID
            if (User.Identity.IsAuthenticated)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid parsedUserId))
                {
                    userId = parsedUserId;
                }
            }

            var review = await _reviewService.CreateReviewAsync(reviewDto, userId);
            return Ok(review);
        }
    }
}