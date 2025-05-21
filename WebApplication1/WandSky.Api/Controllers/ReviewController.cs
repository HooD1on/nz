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

        // 修改为静态只读字段 + 静态构造函数初始化
        private static readonly Dictionary<string, Guid> DestinationSlugToGuidMap;

        // 静态构造函数，使用更安全的初始化方式
        static ReviewController()
        {
            try
            {
                // 先初始化字典，避免失败时为null
                DestinationSlugToGuidMap = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase);

                // 逐个添加映射，而不是使用集合初始化器
                DestinationSlugToGuidMap.Add("queenstown", Guid.Parse("f8a7b3c1-d2e4-4f5a-9b8c-7d6e5f4a3b2c"));
                DestinationSlugToGuidMap.Add("auckland", Guid.Parse("a1b2c3d4-e5f6-4a5b-8c9d-7e6f5a4b3c2"));
                DestinationSlugToGuidMap.Add("rotorua", Guid.Parse("b2c3d4e5-f6a7-5b8c-9d0e-1f2a3b4c5d6"));
                DestinationSlugToGuidMap.Add("milford-sound", Guid.Parse("c3d4e5f6-a7b8-6c9d-0e1f-2a3b4c5d6e7"));
                DestinationSlugToGuidMap.Add("hobbiton", Guid.Parse("d4e5f6a7-b8c9-7d0e-1f2a-3b4c5d6e7f8"));

                // 记录初始化成功
                Console.WriteLine("目的地ID映射表初始化成功，共 " + DestinationSlugToGuidMap.Count + " 个映射");
            }
            catch (Exception ex)
            {
                // 确保字典不为null，即使初始化失败
                if (DestinationSlugToGuidMap == null)
                {
                    DestinationSlugToGuidMap = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase);
                }

                // 记录详细错误信息
                Console.WriteLine($"初始化目的地ID映射表时出错: {ex.Message}");
                Console.WriteLine($"错误类型: {ex.GetType().Name}");
                Console.WriteLine($"堆栈跟踪: {ex.StackTrace}");
            }
        }

        public ReviewController(IReviewService reviewService, ILogger<ReviewController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }

        // 获取目的地评论 - 增强版
        [HttpGet("destination/{destinationId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetDestinationReviews(string destinationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                _logger.LogInformation($"获取评论，目的地ID: {destinationId}, 页码: {page}, 每页数量: {pageSize}");

                // 输入验证
                if (string.IsNullOrEmpty(destinationId))
                {
                    _logger.LogWarning("请求中目的地ID为空");
                    return BadRequest(new { error = "目的地ID不能为空" });
                }

                // 增强的GUID解析 - 更安全的处理
                Guid destinationGuid;
                bool isValidGuid = Guid.TryParse(destinationId, out destinationGuid);

                if (!isValidGuid)
                {
                    _logger.LogInformation($"尝试将字符串ID '{destinationId}' 映射到GUID");

                    // 查找映射
                    if (DestinationSlugToGuidMap.TryGetValue(destinationId, out destinationGuid))
                    {
                        _logger.LogInformation($"成功: 字符串ID '{destinationId}' 映射到GUID: {destinationGuid}");
                    }
                    else
                    {
                        _logger.LogWarning($"警告: 找不到字符串ID '{destinationId}' 的映射");

                        // 为未知ID创建新的GUID并添加到映射中
                        destinationGuid = Guid.NewGuid();
                        try
                        {
                            DestinationSlugToGuidMap[destinationId] = destinationGuid;
                            _logger.LogInformation($"已为未知ID '{destinationId}' 创建新GUID: {destinationGuid}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"更新映射表时出错");
                        }
                    }
                }
                else
                {
                    _logger.LogInformation($"ID '{destinationId}' 已经是有效的GUID格式");
                }

                // 调用服务获取评论数据
                var reviews = await _reviewService.GetDestinationReviewsAsync(destinationGuid, page, pageSize);
                _logger.LogInformation($"成功获取评论，目的地ID: {destinationId}, 数量: {reviews.Count}");

                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"获取评论失败: {ex.Message}");
                return StatusCode(500, new { error = "获取评论失败，请稍后再试", details = ex.Message });
            }
        }

        // 获取评论统计 - 增强版
        [HttpGet("destination/{destinationId}/statistics")]
        public async Task<ActionResult<ReviewStatisticsDto>> GetDestinationReviewStatistics(string destinationId)
        {
            try
            {
                _logger.LogInformation($"获取评论统计，目的地ID: {destinationId}");

                // 输入验证
                if (string.IsNullOrEmpty(destinationId))
                {
                    _logger.LogWarning("请求中目的地ID为空");
                    return BadRequest(new { error = "目的地ID不能为空" });
                }

                // 增强的GUID解析 - 与GetDestinationReviews中相同的逻辑
                Guid destinationGuid;
                bool isValidGuid = Guid.TryParse(destinationId, out destinationGuid);

                if (!isValidGuid)
                {
                    // 查找映射
                    if (DestinationSlugToGuidMap.TryGetValue(destinationId, out destinationGuid))
                    {
                        _logger.LogInformation($"成功: 字符串ID '{destinationId}' 映射到GUID: {destinationGuid}");
                    }
                    else
                    {
                        _logger.LogWarning($"找不到字符串ID '{destinationId}' 的映射");
                        return NotFound(new { error = $"找不到目的地: {destinationId}" });
                    }
                }

                // 调用服务获取统计数据
                var statistics = await _reviewService.GetDestinationReviewStatisticsAsync(destinationGuid);
                _logger.LogInformation($"成功获取统计，目的地ID: {destinationId}, 总评论数: {statistics.TotalReviews}");

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"获取评论统计失败: {ex.Message}");
                return StatusCode(500, new { error = "获取评论统计失败，请稍后再试", details = ex.Message });
            }
        }

        // 创建评论 - 增强版
        [HttpPost]
        public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            try
            {
                // 输入验证
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("提交的评论数据验证失败");
                    return BadRequest(ModelState);
                }

                _logger.LogInformation($"创建评论，目的地ID类型: {reviewDto.DestinationId?.GetType().Name}, 值: {reviewDto.DestinationId}");

                // 处理目的地ID - 更健壮的处理逻辑
                Guid destinationGuid;

                // 处理不同类型的destinationId
                if (reviewDto.DestinationId is Guid guidValue)
                {
                    // 已经是Guid类型
                    destinationGuid = guidValue;
                    _logger.LogInformation($"目的地ID已经是Guid类型: {destinationGuid}");
                }
                else if (reviewDto.DestinationId is string stringValue)
                {
                    // 是字符串类型，尝试解析或查找映射
                    if (Guid.TryParse(stringValue, out destinationGuid))
                    {
                        _logger.LogInformation($"字符串ID '{stringValue}' 成功解析为GUID: {destinationGuid}");
                    }
                    else if (DestinationSlugToGuidMap.TryGetValue(stringValue, out destinationGuid))
                    {
                        _logger.LogInformation($"字符串ID '{stringValue}' 映射到GUID: {destinationGuid}");
                    }
                    else
                    {
                        // 创建新GUID并添加映射
                        destinationGuid = Guid.NewGuid();
                        try
                        {
                            DestinationSlugToGuidMap[stringValue] = destinationGuid;
                            _logger.LogInformation($"为未知字符串ID '{stringValue}' 创建新GUID: {destinationGuid}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"添加新映射时出错");
                        }
                    }
                }
                else if (reviewDto.DestinationId != null)
                {
                    // 其他类型，转为字符串后尝试处理
                    string valueAsString = reviewDto.DestinationId.ToString();
                    _logger.LogWarning($"目的地ID类型不是Guid或字符串，尝试转换字符串: {valueAsString}");

                    if (Guid.TryParse(valueAsString, out destinationGuid))
                    {
                        _logger.LogInformation($"成功将其他类型转换为GUID: {destinationGuid}");
                    }
                    else if (DestinationSlugToGuidMap.TryGetValue(valueAsString, out destinationGuid))
                    {
                        _logger.LogInformation($"其他类型值映射到GUID: {destinationGuid}");
                    }
                    else
                    {
                        // 实在无法处理，创建新GUID
                        destinationGuid = Guid.NewGuid();
                        _logger.LogWarning($"无法解析或映射的目的地ID，创建新GUID: {destinationGuid}");
                    }
                }
                else
                {
                    // destinationId为null
                    return BadRequest(new { error = "目的地ID不能为空" });
                }

                // 更新DTO中的DestinationId
                reviewDto.DestinationId = destinationGuid;

                // 获取用户ID
                Guid? userId = null;
                if (User.Identity.IsAuthenticated)
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                    if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out Guid parsedUserId))
                    {
                        userId = parsedUserId;
                        _logger.LogInformation($"已登录用户ID: {userId}");

                        ModelState.Remove("GuestName");
                        ModelState.Remove("GuestEmail");
                    }
                    else
                    {
                        _logger.LogWarning("找不到用户ID声明或无法解析为GUID");
                    }
                }
                else
                {
                    _logger.LogInformation("游客评论，无用户ID");
                }

                // 调用服务创建评论
                var review = await _reviewService.CreateReviewAsync(reviewDto, userId);
                _logger.LogInformation($"评论创建成功，ID: {review.Id}");

                return Ok(review);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"创建评论失败: {ex.Message}");
                return StatusCode(500, new { error = "创建评论失败，请稍后再试", details = ex.Message });
            }
        }
    }
}