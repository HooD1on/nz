using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using WandSky.Core.DTOs;
using WandSky.Core.Interfaces.Services;

namespace WandSky.Api.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly ILogger<ReviewController> _logger;

        // 添加一个静态映射字典，将字符串ID映射到GUID
        private static readonly Dictionary<string, Guid> DestinationSlugToGuidMap = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase)
        {
            // 为每个目的地创建一个随机GUID
            { "queenstown", new Guid("f8a7b3c1-d2e4-4f5a-9b8c-7d6e5f4a3b2c") },
            { "auckland", new Guid("a1b2c3d4-e5f6-4a5b-8c9d-7e6f5a4b3c2") },
            { "rotorua", new Guid("b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6") },
            { "milford-sound", new Guid("c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7") },
            { "hobbiton", new Guid("d4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8") }
            // 添加更多目的地映射...
        };

        public ReviewController(IReviewService reviewService, ILogger<ReviewController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }

        // 获取目的地评论
        [HttpGet("destination/{destinationId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetDestinationReviews(string destinationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                _logger.LogInformation($"获取评论，目的地ID: {destinationId}, 页码: {page}, 每页数量: {pageSize}");

                // 尝试将输入解析为GUID
                Guid destinationGuid;
                if (!Guid.TryParse(destinationId, out destinationGuid))
                {
                    // 如果不是GUID，查找映射
                    if (DestinationSlugToGuidMap.TryGetValue(destinationId, out destinationGuid))
                    {
                        // 使用映射找到的GUID
                        _logger.LogInformation($"将slug '{destinationId}'映射到GUID: {destinationGuid}");
                    }
                    else
                    {
                        // 如果没有找到映射，可以创建一个新的GUID并添加到映射中
                        destinationGuid = Guid.NewGuid();
                        DestinationSlugToGuidMap[destinationId] = destinationGuid;
                        _logger.LogWarning($"为未知slug '{destinationId}'创建新GUID: {destinationGuid}");
                    }
                }

                var reviews = await _reviewService.GetDestinationReviewsAsync(destinationGuid, page, pageSize);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"获取评论失败: {ex.Message}");
                return StatusCode(500, new { error = "获取评论失败，请稍后再试" });
            }
        }

        // 获取评论统计
        [HttpGet("destination/{destinationId}/statistics")]
        public async Task<ActionResult<ReviewStatisticsDto>> GetDestinationReviewStatistics(string destinationId)
        {
            try
            {
                _logger.LogInformation($"获取评论统计，目的地ID: {destinationId}");

                // 尝试将输入解析为GUID
                Guid destinationGuid;
                if (!Guid.TryParse(destinationId, out destinationGuid))
                {
                    // 如果不是GUID，查找映射
                    if (DestinationSlugToGuidMap.TryGetValue(destinationId, out destinationGuid))
                    {
                        // 使用映射找到的GUID
                        _logger.LogInformation($"将slug '{destinationId}'映射到GUID: {destinationGuid}");
                    }
                    else
                    {
                        // 如果没有找到映射
                        _logger.LogWarning($"找不到slug '{destinationId}'的映射");
                        return NotFound(new { error = $"找不到目的地: {destinationId}" });
                    }
                }

                var statistics = await _reviewService.GetDestinationReviewStatisticsAsync(destinationGuid);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"获取评论统计失败: {ex.Message}");
                return StatusCode(500, new { error = "获取评论统计失败，请稍后再试" });
            }
        }

        // 创建评论
        [HttpPost]
        public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation($"创建评论，目的地ID: {reviewDto.DestinationId}");

                // 处理目的地ID - 可能是字符串或者GUID字符串
                Guid destinationGuid;

                // 如果DestinationId是字符串而不是GUID格式
                if (reviewDto.DestinationId is string && !Guid.TryParse(reviewDto.DestinationId.ToString(), out destinationGuid))
                {
                    string destinationIdStr = reviewDto.DestinationId.ToString();

                    // 查找映射
                    if (DestinationSlugToGuidMap.TryGetValue(destinationIdStr, out destinationGuid))
                    {
                        _logger.LogInformation($"将slug '{destinationIdStr}'映射到GUID: {destinationGuid}");
                    }
                    else
                    {
                        // 如果没有找到映射，创建一个新的GUID
                        destinationGuid = Guid.NewGuid();
                        DestinationSlugToGuidMap[destinationIdStr] = destinationGuid;
                        _logger.LogWarning($"为未知slug '{destinationIdStr}'创建新GUID: {destinationGuid}");
                    }

                    // 更新DTO中的DestinationId
                    reviewDto.DestinationId = destinationGuid;
                }

                Guid? userId = null;

                // 如果用户已登录，获取用户ID
                if (User.Identity.IsAuthenticated)
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                    if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid parsedUserId))
                    {
                        userId = parsedUserId;
                        _logger.LogInformation($"已登录用户ID: {userId}");
                    }
                }
                else
                {
                    _logger.LogInformation("游客评论");
                }

                var review = await _reviewService.CreateReviewAsync(reviewDto, userId);
                return Ok(review);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"创建评论失败: {ex.Message}");
                return StatusCode(500, new { error = "创建评论失败，请稍后再试" });
            }
        }
    }
}