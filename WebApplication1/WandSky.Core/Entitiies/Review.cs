using System;
using System.Collections.Generic;

namespace WandSky.Core.Entities
{

    public class Review : BaseEntity
    {
        public Guid DestinationId { get; set; }

        // 修改为 Guid? 类型
        public Guid? UserId { get; set; } // 可空，因为游客评论没有用户ID

        public string GuestName { get; set; } = string.Empty;
        public string GuestEmail { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public int Rating { get; set; }

        // 导航属性
        public User User { get; set; }
        public List<ReviewImage> Images { get; set; } = new List<ReviewImage>();
    }
}