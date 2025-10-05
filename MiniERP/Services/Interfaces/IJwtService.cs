using MiniERP.Models;

namespace MiniERP.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
