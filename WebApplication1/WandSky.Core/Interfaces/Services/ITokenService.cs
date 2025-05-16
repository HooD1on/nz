using WandSky.Core.Entities;

namespace WandSky.Core.Interfaces.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}