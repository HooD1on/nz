using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Infrastructure.Data;

namespace WandSky.Infrastructure.Repositories
{
    public class ReviewRepository : BaseRepository<Review>, IReviewRepository
    {
        public ReviewRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IReadOnlyList<Review>> GetReviewsByDestinationIdAsync(Guid destinationId, int skip = 0, int take = 10)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Images)
                .Where(r => r.DestinationId == destinationId)
                .OrderByDescending(r => r.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<int> GetReviewsCountByDestinationIdAsync(Guid destinationId)
        {
            return await _context.Reviews
                .Where(r => r.DestinationId == destinationId)
                .CountAsync();
        }

        public async Task<Dictionary<int, int>> GetRatingDistributionByDestinationIdAsync(Guid destinationId)
        {
            var distribution = new Dictionary<int, int>();

            // 初始化评分分布
            for (int i = 1; i <= 5; i++)
            {
                distribution[i] = 0;
            }

            // 获取评分分布
            var ratings = await _context.Reviews
                .Where(r => r.DestinationId == destinationId)
                .GroupBy(r => r.Rating)
                .Select(g => new { Rating = g.Key, Count = g.Count() })
                .ToListAsync();

            foreach (var rating in ratings)
            {
                distribution[rating.Rating] = rating.Count;
            }

            return distribution;
        }

        public async Task<double> GetAverageRatingByDestinationIdAsync(Guid destinationId)
        {
            if (!await _context.Reviews.AnyAsync(r => r.DestinationId == destinationId))
            {
                return 0;
            }

            return await _context.Reviews
                .Where(r => r.DestinationId == destinationId)
                .AverageAsync(r => r.Rating);
        }
    }
}