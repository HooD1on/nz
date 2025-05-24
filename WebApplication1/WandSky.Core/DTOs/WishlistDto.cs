using System.ComponentModel.DataAnnotations;

namespace WandSky.Core.DTOs
{
    public class WishlistItemDto
    {
        public Guid Id { get; set; }
        public string DestinationId { get; set; } = string.Empty;
        public string DestinationTitle { get; set; } = string.Empty;
        public string DestinationImage { get; set; } = string.Empty;
        public string DestinationLocation { get; set; } = string.Empty;
        public decimal? DestinationPrice { get; set; }
        public double? DestinationRating { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AddToWishlistDto
    {
        [Required(ErrorMessage = "目的地ID是必需的")]
        public string DestinationId { get; set; } = string.Empty;

        [Required(ErrorMessage = "目的地标题是必需的")]
        public string DestinationTitle { get; set; } = string.Empty;

        public string DestinationImage { get; set; } = string.Empty;
        public string DestinationLocation { get; set; } = string.Empty;
        public decimal? DestinationPrice { get; set; }
        public double? DestinationRating { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class UpdateWishlistNotesDto
    {
        [StringLength(500, ErrorMessage = "备注最多500个字符")]
        public string Notes { get; set; } = string.Empty;
    }

    public class WishlistResponseDto
    {
        public List<WishlistItemDto> Items { get; set; } = new List<WishlistItemDto>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}