using WandSky.Core.Entities;

namespace WandSky.Core.Entities
{
    public class Wishlist : BaseEntity
    {
        public Guid UserId { get; set; }
        public string DestinationId { get; set; } = string.Empty;
        public string DestinationTitle { get; set; } = string.Empty;
        public string DestinationImage { get; set; } = string.Empty;
        public string DestinationLocation { get; set; } = string.Empty;
        public decimal? DestinationPrice { get; set; }
        public double? DestinationRating { get; set; }
        public string Notes { get; set; } = string.Empty;

        // 导航属性
        public User User { get; set; }
    }
}