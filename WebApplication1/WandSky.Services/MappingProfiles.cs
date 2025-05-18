using AutoMapper;
using WandSky.Core.DTOs;
using WandSky.Core.Entities;

namespace WandSky.Services
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // 现有映射
            CreateMap<User, UserDto>();

            // 新增映射
            CreateMap<User, UserProfileDto>()
                .ForMember(dest => dest.Preferences, opt => opt.MapFrom(src => new UserPreferencesDto
                {
                    Notifications = src.Preferences != null ? src.Preferences.Notifications : true,
                    Newsletter = src.Preferences != null ? src.Preferences.Newsletter : false,
                    TravelPreferences = src.TravelPreferences != null
                        ? src.TravelPreferences.Select(p => p.Preference).ToList()
                        : new List<string>()
                }));

            // 添加 Review 映射
            // 修改 MappingProfiles.cs 文件中关于 Review 映射的代码
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src =>
                    src.UserId.HasValue && src.User != null
                        ? $"{src.User.FirstName} {src.User.LastName}"
                        : (string.IsNullOrEmpty(src.GuestName) ? "游客" : src.GuestName)))
                .ForMember(dest => dest.UserAvatar, opt => opt.MapFrom(src =>
                    src.UserId.HasValue && src.User != null
                        ? (src.User.ProfileImage ?? "/images/avatars/default.jpg")
                        : "/images/avatars/guest.jpg"))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src =>
                    src.CreatedAt.HasValue ? src.CreatedAt.Value.ToString("yyyy-MM-dd") : ""))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src =>
                    src.Images.Select(i => i.ImageUrl).ToList()))
                .ForMember(dest => dest.IsLoggedInUser, opt => opt.MapFrom(src =>
                    src.UserId.HasValue)); // 修改这里，使用 HasValue 代替 string.IsNullOrEmpty
        }
    }
}
