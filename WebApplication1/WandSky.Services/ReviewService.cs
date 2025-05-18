using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public ReviewService(
            IReviewRepository reviewRepository,
            IUserRepository userRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
        }

        public async Task<List<ReviewDto>> GetDestinationReviewsAsync(Guid destinationId, int page = 1, int pageSize = 10)
        {
            int skip = (page - 1) * pageSize;
            var reviews = await _reviewRepository.GetReviewsByDestinationIdAsync(destinationId, skip, pageSize);

            var reviewDtos = new List<ReviewDto>();
            foreach (var review in reviews)
            {
                var reviewDto = new ReviewDto
                {
                    Id = review.Id,
                    Content = review.Content,
                    Rating = review.Rating,
                    Date = review.CreatedAt?.ToString("yyyy-MM-dd") ?? "",
                    Images = review.Images.Select(i => i.ImageUrl).ToList(),
                    IsLoggedInUser = review.UserId.HasValue 
                };

                if (review.UserId.HasValue && review.User != null)
                {
                    reviewDto.UserName = $"{review.User.FirstName} {review.User.LastName}";
                    reviewDto.UserAvatar = review.User.ProfileImage ?? "/images/avatars/default.jpg";
                }
                else
                {
                    reviewDto.UserName = string.IsNullOrEmpty(review.GuestName) ? "游客" : review.GuestName;
                    reviewDto.UserAvatar = "/images/avatars/guest.jpg"; // 默认游客头像
                }

                reviewDtos.Add(reviewDto);
            }

            return reviewDtos;
        }

        public async Task<ReviewStatisticsDto> GetDestinationReviewStatisticsAsync(Guid destinationId)
        {
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

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewDto reviewDto, Guid? userId = null)
        {
            var review = new Review
            {
                Id = Guid.NewGuid(),
                DestinationId = reviewDto.DestinationId,
                Content = reviewDto.Content,
                Rating = reviewDto.Rating,
                CreatedAt = DateTime.UtcNow
            };

            // 处理登录用户和游客的区别
            if (userId.HasValue)
            {
                // 登录用户，现在直接使用 Guid 类型
                review.UserId = userId;
            }
            else
            {
                // 游客
                review.UserId = null;
                review.GuestName = string.IsNullOrEmpty(reviewDto.GuestName) ? "游客" : reviewDto.GuestName;
                review.GuestEmail = reviewDto.GuestEmail ?? string.Empty;
            }

            // 处理图片
            if (reviewDto.Images != null && reviewDto.Images.Count > 0)
            {
                foreach (var imageUrl in reviewDto.Images)
                {
                    review.Images.Add(new ReviewImage
                    {
                        Id = Guid.NewGuid(),
                        ReviewId = review.Id,
                        ImageUrl = imageUrl,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await _reviewRepository.AddAsync(review);

            // 构建返回DTO
            var resultDto = new ReviewDto
            {
                Id = review.Id,
                Content = review.Content,
                Rating = review.Rating,
                Date = review.CreatedAt?.ToString("yyyy-MM-dd") ?? "",
                Images = reviewDto.Images ?? new List<string>(),
                IsLoggedInUser = userId.HasValue // 直接使用传入的 userId 参数判断
            };

            // 处理用户信息
            if (userId.HasValue)
            {
                var user = await _userRepository.GetByIdAsync(userId.Value);
                if (user != null)
                {
                    resultDto.UserName = $"{user.FirstName} {user.LastName}";
                    resultDto.UserAvatar = user.ProfileImage ?? "/images/avatars/default.jpg";
                }
            }
            else
            {
                resultDto.UserName = string.IsNullOrEmpty(review.GuestName) ? "游客" : review.GuestName;
                resultDto.UserAvatar = "/images/avatars/guest.jpg"; // 默认游客头像
            }

            return resultDto;
        }
    }
}