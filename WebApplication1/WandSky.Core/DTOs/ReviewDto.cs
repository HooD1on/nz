using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WandSky.Core.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } // 用户名或游客名
        public string UserAvatar { get; set; } // 用户头像或默认头像
        public string Content { get; set; }
        public int Rating { get; set; }
        public string Date { get; set; } // 格式化的日期
        public List<string> Images { get; set; } = new List<string>();
        public bool IsLoggedInUser { get; set; } // 是否为登录用户
    }

    public class CreateReviewDto
    {
        public Guid DestinationId { get; set; }

        // 游客信息，登录用户不需要填写
        public string GuestName { get; set; }

        public string GuestEmail { get; set; }

        [Required(ErrorMessage = "评论内容是必需的")]
        [StringLength(1000, ErrorMessage = "评论内容最多1000个字符")]
        public string Content { get; set; }

        [Required(ErrorMessage = "评分是必需的")]
        [Range(1, 5, ErrorMessage = "评分必须在1到5之间")]
        public int Rating { get; set; }

        // 图片URL列表，可为空
        public List<string> Images { get; set; } = new List<string>();
    }

    public class ReviewStatisticsDto
    {
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public Dictionary<int, int> RatingDistribution { get; set; } = new Dictionary<int, int>();
    }
}