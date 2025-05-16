namespace WandSky.Core.Entities
{
    // User.cs - 更新现有类
    public class User : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PasswordSalt { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Bio { get; set; } = string.Empty;
        public string ProfileImage { get; set; } = string.Empty;
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpires { get; set; }
        public bool IsGoogleAccount { get; set; }

        // 导航属性
        public UserPreferences? Preferences { get; set; }
        public List<UserTravelPreference>? TravelPreferences { get; set; }

        // 添加新的密码重置字段


        // 添加登录尝试相关字段
        public int LoginFailedCount { get; set; } = 0;           // 失败次数
        public DateTime? LastLoginFailedAt { get; set; }         // 最后一次失败时间
        public DateTime? LockoutEndAt { get; set; }             // 锁定结束时间

        public string? Avatar { get; set; }

    }

    // UserPreferences.cs - 新增类
    public class UserPreferences
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public bool Notifications { get; set; } = true;
        public bool Newsletter { get; set; } = false;

        // 导航属性
        public User User { get; set; }
    }

    // UserTravelPreference.cs - 新增类
    public class UserTravelPreference
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Preference { get; set; }

        // 导航属性
        public User User { get; set; }
    }



}
