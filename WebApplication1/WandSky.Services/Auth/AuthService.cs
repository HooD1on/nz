using AutoMapper;
using WandSky.Core.DTOs.Auth;
using WandSky.Core.DTOs;
using WandSky.Core.Entities;
using WandSky.Core.Interfaces.Repositories;
using WandSky.Core.Interfaces.Services;

namespace WandSky.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AuthService(
            IUserRepository userRepository,
            ITokenService tokenService,
            IMapper mapper)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        public async Task<AuthResponseDto> GoogleSignInAsync(GoogleSignInDto request)
        {
            try
            {
                var user = await _userRepository.GetByEmailAsync(request.Email);

                if (user == null)
                {
                    // 创建新用户
                    user = new User
                    {
                        Id = Guid.NewGuid(),
                        Email = request.Email,
                        FirstName = request.FirstName,
                        LastName = request.LastName,
                        ProfileImage = request.Avatar,
                        IsGoogleAccount = true,
                        // 默认值
                        PasswordHash = string.Empty,
                        PasswordSalt = string.Empty,
                        Address = string.Empty,
                        City = string.Empty,
                        Country = string.Empty,
                        Phone = string.Empty,
                        Bio = string.Empty,
                        LoginFailedCount = 0
                    };

                    await _userRepository.AddAsync(user);
                    Console.WriteLine($"Created new Google user: {user.Email}");
                }
                else if (!user.IsGoogleAccount)
                {
                    // 修改此部分 - 而不是拒绝登录，我们将现有账户关联到Google
                    user.IsGoogleAccount = true;

                    // 可选: 如果用户没有头像但Google提供了，可以更新
                    if (string.IsNullOrEmpty(user.ProfileImage) && !string.IsNullOrEmpty(request.Avatar))
                    {
                        user.ProfileImage = request.Avatar;
                    }

                    await _userRepository.UpdateAsync(user);
                    Console.WriteLine($"Linked existing account to Google: {user.Email}");
                }

                var token = _tokenService.CreateToken(user);

                return new AuthResponseDto
                {
                    Success = true,
                    Token = token,
                    User = _mapper.Map<UserDto>(user)
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Google signin error: {ex.Message}");
                return new AuthResponseDto
                {
                    Success = false,
                    Error = "Google登录失败: " + ex.Message
                };
            }
        }

        public async Task<AuthResponseDto> LoginAsync(UserLoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Error = "用户不存在"
                };
            }

            if (user.IsGoogleAccount)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Error = "此账户为Google账户，请使用Google登录"
                };
            }

            // 检查账户是否被锁定
            if (user.LockoutEndAt.HasValue && user.LockoutEndAt > DateTime.UtcNow)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Error = $"账户已被锁定，请在 {user.LockoutEndAt.Value.ToLocalTime()} 后重试"
                };
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                // 更新失败次数
                user.LoginFailedCount++;
                user.LastLoginFailedAt = DateTime.UtcNow;

                // 如果失败次数达到限制（5次）
                if (user.LoginFailedCount >= 5)
                {
                    user.LockoutEndAt = DateTime.UtcNow.AddMinutes(30); // 锁定30分钟
                }

                await _userRepository.UpdateLoginFailedAsync(user);

                return new AuthResponseDto
                {
                    Success = false,
                    Error = "密码错误"
                };
            }

            // 登录成功，重置失败计数
            user.LoginFailedCount = 0;
            user.LastLoginFailedAt = null;
            user.LockoutEndAt = null;
            await _userRepository.UpdateLoginFailedAsync(user);

            var token = _tokenService.CreateToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(UserRegisterDto registerDto)
        {
            if (await _userRepository.EmailExistsAsync(registerDto.Email))
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Error = "该邮箱已被注册"
                };
            }

            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Error = "两次输入的密码不匹配"
                };
            }

            string passwordSalt = BCrypt.Net.BCrypt.GenerateSalt();
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password, passwordSalt);

            var user = new User
            {
                Id = Guid.NewGuid(),
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email.ToLower(),
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                IsGoogleAccount = false,
                // 默认值
                Address = string.Empty,
                City = string.Empty,
                Country = string.Empty,
                Phone = string.Empty,
                Bio = string.Empty,
                ProfileImage = string.Empty,
                LoginFailedCount = 0
            };

            await _userRepository.AddAsync(user);

            var token = _tokenService.CreateToken(user);

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                User = _mapper.Map<UserDto>(user)
            };
        }

        public async Task<ServiceResponse<bool>> RequestPasswordResetAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                return new ServiceResponse<bool> { Success = true }; // 安全考虑
            }

            if (user.IsGoogleAccount)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = "Google账户不支持此操作"
                };
            }

            string resetToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            DateTime tokenExpires = DateTime.UtcNow.AddHours(24);

            await _userRepository.UpdatePasswordResetTokenAsync(user.Id, resetToken, tokenExpires);

            return new ServiceResponse<bool> { Success = true };
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

            if (user.IsGoogleAccount)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Error = "Google账户不支持此操作"
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