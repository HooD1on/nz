using WandSky.Core.Entities;

namespace WandSky.Infrastructure.Repositories.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        // 基础CRUD方法
        Task<T?> GetByIdAsync(Guid id);
        Task<List<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<bool> ExistsAsync(Guid id);
    }

    // 为Payment添加专门的接口扩展
    public interface IPaymentRepository : IRepository<Payment>
    {
        Task<Payment?> GetByStripeIdAsync(string stripePaymentIntentId);
        Task<List<Payment>> GetByUserIdAsync(Guid userId);
    }

    // 为Booking添加专门的接口扩展
    public interface IBookingRepository : IRepository<Booking>
    {
        Task<Booking?> GetByPaymentIdAsync(Guid paymentId);
        Task<List<Booking>> GetByUserIdAsync(Guid userId);
        Task<Booking?> GetByReferenceAsync(string bookingReference);
    }
}