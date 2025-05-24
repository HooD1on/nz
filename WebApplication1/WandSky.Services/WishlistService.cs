using AutoMapper;
using WandSky.Core.DTOs;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Core.Interfaces.Services;

namespace WandSky.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IWishlistRepository _wishlistRepository;
        private readonly IMapper _mapper;

        public WishlistService(IWishlistRepository wishlistRepository, IMapper mapper)
        {
            _wishlistRepository = wishlistRepository;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<bool>> AddToWishlistAsync(Guid userId, AddToWishlistDto dto)
        {
            try
            {
                var existingItem = await _wishlistRepository.GetByUserAndDestinationAsync(userId, dto.DestinationId);
                if (existingItem != null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "该目的地已在您的收藏夹中"
                    };
                }

                var wishlistItem = new Wishlist
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    DestinationId = dto.DestinationId,
                    DestinationTitle = dto.DestinationTitle,
                    DestinationImage = dto.DestinationImage,
                    DestinationLocation = dto.DestinationLocation,
                    DestinationPrice = dto.DestinationPrice,
                    DestinationRating = dto.DestinationRating,
                    Notes = dto.Notes,
                    CreatedAt = DateTime.UtcNow
                };

                await _wishlistRepository.AddAsync(wishlistItem);
                return new ServiceResponse<bool> { Success = true, Data = true };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"添加收藏失败: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> RemoveFromWishlistAsync(Guid userId, string destinationId)
        {
            try
            {
                await _wishlistRepository.RemoveFromWishlistAsync(userId, destinationId);
                return new ServiceResponse<bool> { Success = true, Data = true };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"移除收藏失败: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<WishlistResponseDto>> GetUserWishlistAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            try
            {
                var skip = (page - 1) * pageSize;
                var items = await _wishlistRepository.GetUserWishlistAsync(userId, skip, pageSize);
                var totalCount = await _wishlistRepository.GetUserWishlistCountAsync(userId);
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                var itemDtos = items.Select(item => new WishlistItemDto
                {
                    Id = item.Id,
                    DestinationId = item.DestinationId,
                    DestinationTitle = item.DestinationTitle,
                    DestinationImage = item.DestinationImage,
                    DestinationLocation = item.DestinationLocation,
                    DestinationPrice = item.DestinationPrice,
                    DestinationRating = item.DestinationRating,
                    Notes = item.Notes,
                    CreatedAt = item.CreatedAt ?? DateTime.MinValue
                }).ToList();

                var response = new WishlistResponseDto
                {
                    Items = itemDtos,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = totalPages
                };

                return new ServiceResponse<WishlistResponseDto> { Success = true, Data = response };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<WishlistResponseDto>
                {
                    Success = false,
                    Error = $"获取收藏列表失败: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> IsInWishlistAsync(Guid userId, string destinationId)
        {
            try
            {
                var isInWishlist = await _wishlistRepository.IsInWishlistAsync(userId, destinationId);
                return new ServiceResponse<bool> { Success = true, Data = isInWishlist };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"检查收藏状态失败: {ex.Message}"
                };
            }
        }

        public async Task<ServiceResponse<bool>> UpdateNotesAsync(Guid userId, Guid wishlistItemId, string notes)
        {
            try
            {
                var item = await _wishlistRepository.GetByIdAsync(wishlistItemId);
                if (item == null || item.UserId != userId)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Error = "收藏项不存在或无权限"
                    };
                }

                item.Notes = notes;
                await _wishlistRepository.UpdateAsync(item);
                return new ServiceResponse<bool> { Success = true, Data = true };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = $"更新备注失败: {ex.Message}"
                };
            }
        }
    }
}