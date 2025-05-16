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
        }
    }
}