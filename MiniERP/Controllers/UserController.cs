using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniERP.Data;
using MiniERP.Models;
using MiniERP.Services.Helpers;
using MiniERP.Services.Interfaces;

namespace MiniERP.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IJwtService _jwt;

        public UserController(AppDbContext db, IJwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        // ✅ Register
        [HttpPost("register")]
        public IActionResult Register(RegisterRequest request)
        {
            if (_db.Users.Any(u => u.username == request.Username))
                return Conflict(new { message = "Username already exists" });

            PasswordHelper.CreatePasswordHash(request.Password, out string hash, out string salt);

            var user = new User
            {
                username = request.Username,
                email = request.Email,
                passwordHash = hash,
                passwordSalt = salt,
                isActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return Ok(new { message = "User registered successfully" });
        }

        // ✅ Login
        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var user = _db.Users.FirstOrDefault(u => u.username == request.username);

            if (user == null || !PasswordHelper.VerifyPasswordHash(request.password, user.passwordHash, user.passwordSalt))
                return Unauthorized(new { message = "Invalid username or password" });

            user.lastLogin = DateTime.UtcNow;
            _db.SaveChanges();

            var token = _jwt.GenerateToken(user);

            return Ok(new { token });
        }

        // ✅ Get Profile
        [HttpGet("me")]
        public IActionResult GetProfile()
        {
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            var user = _db.Users.FirstOrDefault(u => u.username == username);
            if (user == null) return NotFound();

            return Ok(new
            {
                user.Id,
                user.username,
                user.email,
                user.isActive,
                user.lastLogin
            });
        }
    }

}
