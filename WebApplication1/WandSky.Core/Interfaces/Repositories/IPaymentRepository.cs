using WandSky.Core.Entities;

namespace WandSky.Core.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task<Payment> CreateAsync(Payment payment);
        Task<Payment?> GetByIdAsync(Guid id);
        Task<Payment?> GetByStripeIdAsync(string stripePaymentIntentId);
        Task<List<Payment>> GetByUserIdAsync(Guid userId);
        Task UpdateAsync(Payment payment);
        Task DeleteAsync(Payment payment);
        Task<bool> ExistsAsync(Guid id);
    }
}

