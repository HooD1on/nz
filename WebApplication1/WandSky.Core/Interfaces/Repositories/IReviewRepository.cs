using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WandSky.Core.Entities;

namespace WandSky.Core.Interfaces.Repositories
{
    public interface IReviewRepository : IBaseRepository<Review>
    {
        Task<IReadOnlyList<Review>> GetReviewsByDestinationIdAsync(Guid destinationId, int skip = 0, int take = 10);
        Task<int> GetReviewsCountByDestinationIdAsync(Guid destinationId);
        Task<Dictionary<int, int>> GetRatingDistributionByDestinationIdAsync(Guid destinationId);
        Task<double> GetAverageRatingByDestinationIdAsync(Guid destinationId);
    }
}