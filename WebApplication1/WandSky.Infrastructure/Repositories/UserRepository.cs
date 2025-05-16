using Microsoft.EntityFrameworkCore;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Infrastructure.Data;

namespace WandSky.Infrastructure.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users
                .AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User> GetUserWithPreferencesByIdAsync(Guid userId)
        {
            return await _context.Users
                .Include(u => u.Preferences)
                .Include(u => u.TravelPreferences)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task UpdateUserPreferencesAsync(Guid userId, List<string> preferences)
        {
            // 删除现有偏好
            var existingPreferences = await _context.UserTravelPreferences
                .Where(p => p.UserId == userId)
                .ToListAsync();

            _context.UserTravelPreferences.RemoveRange(existingPreferences);

            // 添加新偏好
            if (preferences != null && preferences.Count > 0)
            {
                foreach (var preference in preferences)
                {
                    _context.UserTravelPreferences.Add(new UserTravelPreference
                    {
                        UserId = userId,
                        Preference = preference
                    });
                }
            }

            await _context.SaveChangesAsync();
        }


        public async Task<User> GetByPasswordResetTokenAsync(string token)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.PasswordResetToken == token &&
                                        u.PasswordResetTokenExpires > DateTime.UtcNow);
        }

        public async Task UpdatePasswordResetTokenAsync(Guid userId, string token, DateTime? expires)
        {
            var user = await GetByIdAsync(userId);
            if (user != null)
            {
                user.PasswordResetToken = token;
                user.PasswordResetTokenExpires = expires;
                await UpdateAsync(user);
            }
        }


        public async Task UpdateLoginFailedAsync(User user)
        {
            _context.Entry(user).Property(x => x.LoginFailedCount).IsModified = true;
            _context.Entry(user).Property(x => x.LastLoginFailedAt).IsModified = true;
            _context.Entry(user).Property(x => x.LockoutEndAt).IsModified = true;
            await _context.SaveChangesAsync();
        }



        public async Task<User?> FindByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

    }
}
