using WandSky.Core.Entities;

namespace WandSky.Core.Interfaces.Repositories
{
    public interface IBookingRepository
    {
        Task<Booking> CreateAsync(Booking booking);
        Task<Booking?> GetByIdAsync(Guid id);
        Task<Booking?> GetByPaymentIdAsync(Guid paymentId);
        Task<Booking?> GetByReferenceAsync(string bookingReference);
        Task<List<Booking>> GetByUserIdAsync(Guid userId);
        Task UpdateAsync(Booking booking);
        Task DeleteAsync(Booking booking);
        Task<bool> ExistsAsync(Guid id);
    }
}
