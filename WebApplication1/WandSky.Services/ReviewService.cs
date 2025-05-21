// WebApplication1/WandSky.Services/ReviewService.cs
// 修复接口实现问题

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using WandSky.Core.DTOs;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Core.Interfaces.Services;

namespace WandSky.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ReviewService> _logger;

        public ReviewService(
            IReviewRepository reviewRepository,
            IUserRepository userRepository,
            ILogger<ReviewService> logger)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        // 确保方法签名与接口定义完全匹配
        public async Task<List<ReviewDto>> GetDestinationReviewsAsync(Guid destinationId, int page = 1, int pageSize = 10)
        {
            try
            {
                _logger.LogInformation($"获取评论, 目的地ID: {destinationId}, 页码: {page}, 每页数量: {pageSize}");

                int skip = (page - 1) * pageSize;
                var reviews = await _reviewRepository.GetReviewsByDestinationIdAsync(destinationId, skip, pageSize);

                var reviewDtos = new List<ReviewDto>();
                foreach (var review in reviews)
                {
                    _logger.LogInformation($"处理评论: {review.Id}, 用户ID: {review.UserId}");

                    var reviewDto = new ReviewDto
                    {
                        Id = review.Id,
                        Content = review.Content,
                        Rating = review.Rating,
                        Date = review.CreatedAt?.ToString("yyyy-MM-dd") ?? "",
                        Images = review.Images?.Select(i => i.ImageUrl).ToList() ?? new List<string>(),
                        IsLoggedInUser = review.UserId.HasValue
                    };

                    if (review.UserId.HasValue)
                    {
                        try
                        {
                            var user = await _userRepository.GetByIdAsync(review.UserId.Value);
                            if (user != null)
                            {
                                reviewDto.UserName = $"{user.FirstName} {user.LastName}";
                                reviewDto.UserAvatar = user.ProfileImage ?? "/images/avatars/default.jpg";
                                _logger.LogInformation($"找到用户: {user.FirstName} {user.LastName}");
                            }
                            else
                            {
                                reviewDto.UserName = "未知用户";
                                reviewDto.UserAvatar = "/images/avatars/default.jpg";
                                _logger.LogWarning($"找不到用户ID: {review.UserId.Value}");
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"获取用户失败: {review.UserId.Value}");
                            reviewDto.UserName = "未知用户";
                            reviewDto.UserAvatar = "/images/avatars/default.jpg";
                        }
                    }
                    else
                    {
                        reviewDto.UserName = string.IsNullOrEmpty(review.GuestName) ? "游客" : review.GuestName;
                        reviewDto.UserAvatar = "/images/avatars/guest.jpg"; // 默认游客头像
                        _logger.LogInformation($"游客评论, 名称: {reviewDto.UserName}");
                    }

                    reviewDtos.Add(reviewDto);
                }

                return reviewDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"获取评论失败: {ex.Message}");
                throw;
            }
        }

        // 确保方法签名与接口定义完全匹配
        public async Task<ReviewStatisticsDto> GetDestinationReviewStatisticsAsync(Guid destinationId)
        {
            try
            {
                _logger.LogInformation($"获取评论统计, 目的地ID: {destinationId}");

                var totalReviews = await _reviewRepository.GetReviewsCountByDestinationIdAsync(destinationId);
                var averageRating = await _reviewRepository.GetAverageRatingByDestinationIdAsync(destinationId);
                var ratingDistribution = await _reviewRepository.GetRatingDistributionByDestinationIdAsync(destinationId);

                return new ReviewStatisticsDto
                {
                    TotalReviews = totalReviews,
                    AverageRating = Math.Round(averageRating, 1),
                    RatingDistribution = ratingDistribution
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"获取评论统计失败: {ex.Message}");
                throw;
            }
        }

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto reviewDto, Guid? userId = null)
        {
            try
            {
                // 改进的目的地ID处理
                Guid destinationGuid;

                if (reviewDto.DestinationId is Guid guidValue)
                {
                    destinationGuid = guidValue;
                    _logger.LogInformation($"目的地ID已经是Guid类型: {destinationGuid}");
                }
                else
                {
                    // 尝试将其他类型转换为Guid
                    string destinationIdStr = reviewDto.DestinationId?.ToString() ?? string.Empty;

                    if (Guid.TryParse(destinationIdStr, out destinationGuid))
                    {
                        _logger.LogInformation($"成功将目的地ID转换为Guid: {destinationGuid}");
                    }
                    else
                    {
                        _logger.LogError($"无效的目的地ID格式: {reviewDto.DestinationId}");
                        throw new ArgumentException($"无效的目的地ID格式: {reviewDto.DestinationId}");
                    }
                }

                _logger.LogInformation($"创建评论, 目的地ID: {destinationGuid}, 用户ID: {userId}");

                // 创建评论实体
                var review = new Review
                {
                    Id = Guid.NewGuid(),
                    DestinationId = destinationGuid,
                    Content = reviewDto.Content,
                    Rating = reviewDto.Rating,
                    CreatedAt = DateTime.UtcNow
                };

                // 设置用户ID或游客信息
                if (userId.HasValue)
                {
                    review.UserId = userId;
                }
                else
                {
                    review.UserId = null;
                    review.GuestName = reviewDto.GuestName ?? "游客";
                    review.GuestEmail = reviewDto.GuestEmail ?? string.Empty;
                    _logger.LogInformation($"游客评论: {review.GuestName}");
                }

                // 处理图片
                if (reviewDto.Images != null && reviewDto.Images.Count > 0)
                {
                    _logger.LogInformation($"处理{reviewDto.Images.Count}张图片");
                    review.Images = new List<ReviewImage>();

                    foreach (var imageUrl in reviewDto.Images)
                    {
                        if (string.IsNullOrEmpty(imageUrl))
                        {
                            _logger.LogWarning("跳过空图片URL");
                            continue;
                        }

                        review.Images.Add(new ReviewImage
                        {
                            Id = Guid.NewGuid(),
                            ReviewId = review.Id,
                            ImageUrl = imageUrl,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }
                else
                {
                    review.Images = new List<ReviewImage>();
                }

                // 保存评论
                await _reviewRepository.AddAsync(review);
                _logger.LogInformation($"评论保存成功, ID: {review.Id}");

                // 构建返回DTO
                var resultDto = new ReviewDto
                {
                    Id = review.Id,
                    Content = review.Content,
                    Rating = review.Rating,
                    Date = review.CreatedAt?.ToString("yyyy-MM-dd") ?? "",
                    Images = reviewDto.Images ?? new List<string>(),
                    IsLoggedInUser = userId.HasValue
                };

                // 处理用户信息
                if (userId.HasValue)
                {
                    try
                    {
                        var user = await _userRepository.GetByIdAsync(userId.Value);
                        if (user != null)
                        {
                            resultDto.UserName = $"{user.FirstName} {user.LastName}";
                            resultDto.UserAvatar = user.ProfileImage ?? "/images/avatars/default.jpg";
                            _logger.LogInformation($"用户信息: {resultDto.UserName}");
                        }
                        else
                        {
                            resultDto.UserName = "未知用户";
                            resultDto.UserAvatar = "/images/avatars/default.jpg";
                            _logger.LogWarning($"找不到用户ID: {userId.Value}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"获取用户信息失败: {userId.Value}");
                        resultDto.UserName = "未知用户";
                        resultDto.UserAvatar = "/images/avatars/default.jpg";
                    }
                }
                else
                {
                    resultDto.UserName = string.IsNullOrEmpty(review.GuestName) ? "游客" : review.GuestName;
                    resultDto.UserAvatar = "/images/avatars/guest.jpg"; // 默认游客头像
                    _logger.LogInformation($"游客评论信息: {resultDto.UserName}");
                }

                return resultDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"创建评论失败: {ex.Message}");
                throw;
            }
        }
    }
}