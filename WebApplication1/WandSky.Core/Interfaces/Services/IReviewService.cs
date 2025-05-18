using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WandSky.Core.DTOs;

namespace WandSky.Core.Interfaces.Services
{
    public interface IReviewService
    {
        Task<List<ReviewDto>> GetDestinationReviewsAsync(Guid destinationId, int page = 1, int pageSize = 10);
        Task<ReviewStatisticsDto> GetDestinationReviewStatisticsAsync(Guid destinationId);
        Task<ReviewDto> CreateReviewAsync(CreateReviewDto reviewDto, Guid? userId = null);
    }
}