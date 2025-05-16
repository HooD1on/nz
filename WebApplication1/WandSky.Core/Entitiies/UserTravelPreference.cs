using WandSky.Core.Entities;

namespace WandSky.Core.Entitiies
{
    namespace WandSky.Core.Entities
    {
        public class UserTravelPreference
        {
            public Guid Id { get; set; }
            public Guid UserId { get; set; }
            public string Preference { get; set; }

            // 导航属性
            public User User { get; set; }
        }
    }
}
