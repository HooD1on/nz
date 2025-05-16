using WandSky.Core.Entities;

namespace WandSky.Core.Entitiies
{
    namespace WandSky.Core.Entities
    {
        public class UserPreferences
        {
            public Guid Id { get; set; }
            public Guid UserId { get; set; }
            public bool Notifications { get; set; } = true;
            public bool Newsletter { get; set; } = false;

            // 导航属性
            public User User { get; set; }
        }
    }
}
