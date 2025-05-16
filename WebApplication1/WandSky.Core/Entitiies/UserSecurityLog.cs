using WandSky.Core.Entities;

namespace WandSky.Core.Entitiies
{
    public class UserSecurityLog : BaseEntity
    {
        public Guid UserId { get; set; }
        public string EventType { get; set; } // Login, PasswordChanged, LoginFailed 等
        public string IPAddress { get; set; }
        public string UserAgent { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // 导航属性
        public User User { get; set; }
    }
}
