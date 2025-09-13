using WandSky.Core.Entities;
using WandSky.Services.DTOs.Booking;

namespace WandSky.Services.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateAsync(CreateBookingDto createBookingDto);
        Task<BookingResponseDto?> GetByIdAsync(Guid id);
        Task<BookingResponseDto?> GetByPaymentIdAsync(Guid paymentId);
        Task<BookingResponseDto?> GetByReferenceAsync(string bookingReference);
        Task<List<BookingResponseDto>> GetByUserIdAsync(Guid userId);
        Task<BookingResponseDto> UpdateAsync(Guid id, CreateBookingDto updateBookingDto);
        Task DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);
    }
}