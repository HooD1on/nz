using Microsoft.AspNetCore.Mvc.ViewEngines;
using System;

namespace WandSky.Core.Entities
{
    public class ReviewImage : BaseEntity
    {
        public Guid ReviewId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        // 导航属性
        public Review Review { get; set; }
    }
}
