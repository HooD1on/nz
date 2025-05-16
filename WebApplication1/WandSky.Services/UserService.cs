using WandSky.Core.Interfaces.Repositories;
using WandSky.Core.Interfaces.Services;
using WandSky.Core.DTOs;
using AutoMapper;
using WandSky.Core.Entities;

namespace WandSky.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<UserProfileDto> GetUserProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetUserWithPreferencesByIdAsync(userId);
            return _mapper.Map<UserProfileDto>(user);
        }

        public async Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            if (!string.IsNullOrEmpty(updateProfileDto.Email) &&
                !string.Equals(user.Email, updateProfileDto.Email, StringComparison.OrdinalIgnoreCase))
            {
                var emailExists = await _userRepository.EmailExistsAsync(updateProfileDto.Email);
                if (emailExists)
                {
                    throw new InvalidOperationException("该电子邮件地址已被使用");
                }
            }

            UpdateUserProperties(user, updateProfileDto);
            await _userRepository.UpdateAsync(user);

            return _mapper.Map<UserProfileDto>(user);
        }

        private void UpdateUserProperties(User user, UpdateProfileDto updateProfileDto)
        {
            if (!string.IsNullOrEmpty(updateProfileDto.FirstName))
                user.FirstName = updateProfileDto.FirstName;

            if (!string.IsNullOrEmpty(updateProfileDto.LastName))
                user.LastName = updateProfileDto.LastName;

            if (!string.IsNullOrEmpty(updateProfileDto.Email))
                user.Email = updateProfileDto.Email;

            if (updateProfileDto.Phone != null)
                user.Phone = updateProfileDto.Phone;

            if (updateProfileDto.Address != null)
                user.Address = updateProfileDto.Address;

            if (updateProfileDto.City != null)
                user.City = updateProfileDto.City;

            if (updateProfileDto.Country != null)
                user.Country = updateProfileDto.Country;

            if (updateProfileDto.Bio != null)
                user.Bio = updateProfileDto.Bio;

            if (updateProfileDto.ProfileImage != null)
                user.ProfileImage = updateProfileDto.ProfileImage;
        }

        public async Task<ServiceResponse<bool>> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = "User not found"
                };
            }

            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = "Current password is incorrect"
                };
            }

            string passwordSalt = BCrypt.Net.BCrypt.GenerateSalt();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _userRepository.UpdateAsync(user);

            return new ServiceResponse<bool>
            {
                Success = true,
                Data = true
            };
        }

        public async Task<UserPreferencesDto> UpdatePreferencesAsync(Guid userId, UpdatePreferencesDto preferencesDto)
        {
            var user = await _userRepository.GetUserWithPreferencesByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            if (user.Preferences == null)
            {
                user.Preferences = new UserPreferences
                {
                    UserId = userId,
                    Notifications = preferencesDto.Notifications,
                    Newsletter = preferencesDto.Newsletter
                };
            }
            else
            {
                user.Preferences.Notifications = preferencesDto.Notifications;
                user.Preferences.Newsletter = preferencesDto.Newsletter;
            }

            await _userRepository.UpdateUserPreferencesAsync(userId, preferencesDto.TravelPreferences);
            await _userRepository.UpdateAsync(user);

            return new UserPreferencesDto
            {
                Notifications = user.Preferences.Notifications,
                Newsletter = user.Preferences.Newsletter,
                TravelPreferences = preferencesDto.TravelPreferences
            };
        }

        public async Task<ServiceResponse<bool>> RequestPasswordResetAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return new ServiceResponse<bool> { Success = true };
            }

            string resetToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            DateTime tokenExpires = DateTime.UtcNow.AddHours(24);

            await _userRepository.UpdatePasswordResetTokenAsync(user.Id, resetToken, tokenExpires);

            return new ServiceResponse<bool> { Success = true };
        }

        public async Task<ServiceResponse<UserDto>> SyncGoogleUserAsync(GoogleUserDto dto)
        {
            try
            {
                var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
                if (existingUser == null)
                {
                    var newUser = new User
                    {
                        Id = Guid.NewGuid(),
                        Email = dto.Email ?? string.Empty,
                        FirstName = dto.FirstName ?? string.Empty,
                        LastName = dto.LastName ?? string.Empty,
                        ProfileImage = dto.Avatar ?? string.Empty,
                        IsGoogleAccount = true,
                        Address = string.Empty,
                        City = string.Empty,
                        Country = string.Empty,
                        Phone = string.Empty,
                        Bio = string.Empty
                    };
                    await _userRepository.CreateAsync(newUser);
                    return new ServiceResponse<UserDto>
                    {
                        Success = true,
                        Data = _mapper.Map<UserDto>(newUser)
                    };
                }

                return new ServiceResponse<UserDto>
                {
                    Success = true,
                    Data = _mapper.Map<UserDto>(existingUser)
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<UserDto>
                {
                    Success = false,
                    Error = ex.Message
                };
            }
        }

        public async Task<ServiceResponse<bool>> ResetPasswordWithTokenAsync(string token, string newPassword)
        {
            var user = await _userRepository.GetByPasswordResetTokenAsync(token);
            if (user == null || user.PasswordResetTokenExpires < DateTime.UtcNow)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = "无效或已过期的重置令牌"
                };
            }

            string passwordSalt = BCrypt.Net.BCrypt.GenerateSalt();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpires = null;

            await _userRepository.UpdateAsync(user);

            return new ServiceResponse<bool> { Success = true };
        }
    }
}