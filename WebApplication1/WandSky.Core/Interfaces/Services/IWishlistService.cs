using WandSky.Core.DTOs;

namespace WandSky.Core.Interfaces.Services
{
    public interface IWishlistService
    {
        Task<ServiceResponse<bool>> AddToWishlistAsync(Guid userId, AddToWishlistDto dto);
        Task<ServiceResponse<bool>> RemoveFromWishlistAsync(Guid userId, string destinationId);
        Task<ServiceResponse<WishlistResponseDto>> GetUserWishlistAsync(Guid userId, int page = 1, int pageSize = 20);
        Task<ServiceResponse<bool>> IsInWishlistAsync(Guid userId, string destinationId);
        Task<ServiceResponse<bool>> UpdateNotesAsync(Guid userId, Guid wishlistItemId, string notes);
    }
}