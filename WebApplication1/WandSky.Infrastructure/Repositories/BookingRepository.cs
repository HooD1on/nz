using Microsoft.EntityFrameworkCore;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Infrastructure.Data;

namespace WandSky.Infrastructure.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public BookingRepository(ApplicationDbContext context)
        {
            _dbContext = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Booking> CreateAsync(Booking booking)
        {
            if (booking == null)
                throw new ArgumentNullException(nameof(booking));

            _dbContext.Bookings.Add(booking);
            await _dbContext.SaveChangesAsync();
            return booking;
        }

        public async Task<Booking?> GetByIdAsync(Guid id)
        {
            return await _dbContext.Bookings
                .Include(b => b.User)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Booking?> GetByPaymentIdAsync(Guid paymentId)
        {
            return await _dbContext.Bookings
                .Include(b => b.User)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.PaymentId == paymentId);
        }

        public async Task<Booking?> GetByReferenceAsync(string bookingReference)
        {
            if (string.IsNullOrEmpty(bookingReference))
                return null;

            return await _dbContext.Bookings
                .Include(b => b.User)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingReference == bookingReference);
        }

        public async Task<List<Booking>> GetByUserIdAsync(Guid userId)
        {
            return await _dbContext.Bookings
                .Include(b => b.Payment)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateAsync(Booking booking)
        {
            if (booking == null)
                throw new ArgumentNullException(nameof(booking));

            _dbContext.Bookings.Update(booking);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Booking booking)
        {
            if (booking == null)
                throw new ArgumentNullException(nameof(booking));

            _dbContext.Bookings.Remove(booking);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _dbContext.Bookings.AnyAsync(b => b.Id == id);
        }
    }
}