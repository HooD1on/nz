using WandSky.Core.Entities;

namespace WandSky.Core.Interfaces.Repositories
{
    public interface IWishlistRepository : IBaseRepository<Wishlist>
    {
        Task<Wishlist?> GetByUserAndDestinationAsync(Guid userId, string destinationId);
        Task<IReadOnlyList<Wishlist>> GetUserWishlistAsync(Guid userId, int skip = 0, int take = 20);
        Task<int> GetUserWishlistCountAsync(Guid userId);
        Task<bool> IsInWishlistAsync(Guid userId, string destinationId);
        Task RemoveFromWishlistAsync(Guid userId, string destinationId);
    }
}