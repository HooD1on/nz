
using System.Threading.Tasks;
using WandSky.Core.Entitiies;
using WandSky.Core.Entities;

namespace WandSky.Core.Interfaces.Repositories
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<User> GetByEmailAsync(string email);
        Task<bool> EmailExistsAsync(string email);
        Task<User> GetUserWithPreferencesByIdAsync(Guid userId);
        Task UpdateUserPreferencesAsync(Guid userId, List<string> preferences);
        Task<User> GetByPasswordResetTokenAsync(string token);
        Task UpdatePasswordResetTokenAsync(Guid userId, string token, DateTime? expires);

        Task UpdateLoginFailedAsync(User user);

        Task<User?> FindByEmailAsync(string email);
        Task CreateAsync(User user);
    }
}
