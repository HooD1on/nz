using WandSky.Core.DTOs;


namespace WandSky.Core.Interfaces.Services
{
    public interface IUserService
    {
        Task<UserProfileDto> GetUserProfileAsync(Guid userId);
        Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto updateProfileDto);
        Task<ServiceResponse<bool>> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
        Task<UserPreferencesDto> UpdatePreferencesAsync(Guid userId, UpdatePreferencesDto preferencesDto);
        Task<ServiceResponse<bool>> RequestPasswordResetAsync(string email);
        Task<ServiceResponse<bool>> ResetPasswordWithTokenAsync(string token, string newPassword);
        Task<ServiceResponse<UserDto>> SyncGoogleUserAsync(GoogleUserDto dto);

    }
}
