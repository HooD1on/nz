using Microsoft.EntityFrameworkCore;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Infrastructure.Data;

namespace WandSky.Infrastructure.Repositories
{
    public class WishlistRepository : BaseRepository<Wishlist>, IWishlistRepository
    {
        public WishlistRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<Wishlist?> GetByUserAndDestinationAsync(Guid userId, string destinationId)
        {
            return await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.DestinationId == destinationId);
        }

        public async Task<IReadOnlyList<Wishlist>> GetUserWishlistAsync(Guid userId, int skip = 0, int take = 20)
        {
            return await _context.Wishlists
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetUserWishlistCountAsync(Guid userId)
        {
            return await _context.Wishlists
                .Where(w => w.UserId == userId)
                .CountAsync();
        }

        public async Task<bool> IsInWishlistAsync(Guid userId, string destinationId)
        {
            return await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.DestinationId == destinationId);
        }

        public async Task RemoveFromWishlistAsync(Guid userId, string destinationId)
        {
            var wishlistItem = await GetByUserAndDestinationAsync(userId, destinationId);
            if (wishlistItem != null)
            {
                await DeleteAsync(wishlistItem);
            }
        }
    }
}
