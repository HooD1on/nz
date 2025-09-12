using Microsoft.EntityFrameworkCore;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Infrastructure.Data;

namespace WandSky.Infrastructure.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public PaymentRepository(ApplicationDbContext context)
        {
            _dbContext = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Payment> CreateAsync(Payment payment)
        {
            if (payment == null)
                throw new ArgumentNullException(nameof(payment));

            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment?> GetByIdAsync(Guid id)
        {
            return await _dbContext.Payments
                .Include(p => p.User)
                .Include(p => p.Bookings)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Payment?> GetByStripeIdAsync(string stripePaymentIntentId)
        {
            if (string.IsNullOrEmpty(stripePaymentIntentId))
                return null;

            return await _dbContext.Payments
                .Include(p => p.User)
                .Include(p => p.Bookings)
                .FirstOrDefaultAsync(p => p.StripePaymentIntentId == stripePaymentIntentId);
        }

        public async Task<List<Payment>> GetByUserIdAsync(Guid userId)
        {
            return await _dbContext.Payments
                .Include(p => p.Bookings)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task UpdateAsync(Payment payment)
        {
            if (payment == null)
                throw new ArgumentNullException(nameof(payment));

            _dbContext.Payments.Update(payment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Payment payment)
        {
            if (payment == null)
                throw new ArgumentNullException(nameof(payment));

            _dbContext.Payments.Remove(payment);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _dbContext.Payments.AnyAsync(p => p.Id == id);
        }
    }
}
