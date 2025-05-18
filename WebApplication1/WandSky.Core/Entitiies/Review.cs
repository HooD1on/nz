using System;
using System.Collections.Generic;

namespace WandSky.Core.Entities
{
    // WandSky.Core/Entities/Review.cs
    public class Review : BaseEntity
    {
        public Guid DestinationId { get; set; }
        public string UserId { get; set; } // 保持为string类型
        public string GuestName { get; set; } = string.Empty;
        public string GuestEmail { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }

        // 导航属性
        public User User { get; set; }
        public List<ReviewImage> Images { get; set; } = new List<ReviewImage>();
    }
}