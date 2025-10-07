using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniERP.Data;
using MiniERP.Models;
using MiniERP.Models.DTO;
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
        public IActionResult Register([FromBody] RegisterRequest request)
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
            var newProfile = new UserProfile
            {
                UserId = user.Id,
                Email = user.email,
                FirstName = "",
                LastName = "",
                Address =  "",
                PhoneNumber ="",
                Salary = 0,
                position = "",
                department =  "",
                gender =  "",
                birthday =  "",
                description =  "",
                AvatarUrl =  "",
                HireDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")),
                EndDate = DateTime.MinValue,
            };
            _db.UserProfiles.Add(newProfile);
            _db.SaveChanges();

            return Ok(new { message = "User registered successfully" });
        }

        // ✅ Login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _db.Users.FirstOrDefault(u => u.username == request.username);

            if (user == null || !PasswordHelper.VerifyPasswordHash(request.password, user.passwordHash, user.passwordSalt))
                return Unauthorized(new { message = "Invalid username or password" });

            user.lastLogin = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            user.isActive = true;
            _db.SaveChanges();

            var token = _jwt.GenerateToken(user);

            //var cookieOptions = new CookieOptions
            //{
            //    HttpOnly = true, 
            //    Secure = false,   
            //    SameSite = SameSiteMode.None,
            //    //Expires = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")).AddHours(8)
            //    Expires = DateTime.UtcNow.AddHours(2)
            //};

            //Response.Cookies.Append("jwt_token", token, cookieOptions);



            //return Ok(new { message = "Login successful" });
            return Ok(new
            {
                message = "Login successful",
                token = token,
                user = new
                {
                    user.Id,
                    user.username,
                    user.email,
                    user.isActive,
                    user.Role,
                    user.lastLogin,
                }
            });
        }

        // ✅ Get Profile
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetProfile()
        {
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            var userWithProfile = _db.Users
        .Where(u => u.username == username)
        .Select(u => new
        {
            u.Id,
            u.username,
            u.email,
            u.isActive,
            u.Role,
            u.lastLogin,
            Profile = _db.UserProfiles
                        .Where(p => p.UserId == u.Id)
                        .Select(p => new
                        {
                            p.FirstName,
                            p.LastName,
                            p.PhoneNumber,
                            p.Address,
                            p.Salary,
                            p.position,
                            p.department,
                            p.gender,
                            p.birthday,
                            p.description,
                            p.AvatarUrl,
                            p.HireDate,
                            p.EndDate
                        }).FirstOrDefault()
        })
        .FirstOrDefault();

            if (userWithProfile == null) return NotFound();

            return Ok(userWithProfile);
        }

        [HttpPost("change-password")]
        [Authorize] 
        public IActionResult ChangePassword(ChangePasswordRequest request)
        {
 
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            var user = _db.Users.FirstOrDefault(u => u.username == username);
            if (user == null) return NotFound(new { message = "User not found" });

 
            if (!PasswordHelper.VerifyPasswordHash(request.OldPassword, user.passwordHash, user.passwordSalt))
                return BadRequest(new { message = "Old password is incorrect" });

            PasswordHelper.CreatePasswordHash(request.NewPassword, out string newHash, out string newSalt);

            user.passwordHash = newHash;
            user.passwordSalt = newSalt;
            user.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));

            _db.SaveChanges();

            return Ok(new { message = "Password changed successfully" });
        }


        [HttpPost("update-role")]
        [Authorize(Roles = "Admin")] 
        public IActionResult UpdateUserRole(UpdateUserRoleRequest request)
        {
            var user = _db.Users.FirstOrDefault(u => u.username == request.Username);
            if (user == null) return NotFound(new { message = "User not found" });

    
            if (!Enum.TryParse<UserRole>(request.Role, true, out var newRole))
                return BadRequest(new { message = "Invalid role" });

            user.Role = newRole;
            user.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));

            _db.SaveChanges();

            return Ok(new { message = $"User role updated to {newRole}" });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            var user = _db.Users.FirstOrDefault(u => u.username == username);
            if (user == null) return NotFound(new { message = "User not found" });

            user.lastLogin = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
            user.isActive = false;

            _db.SaveChanges();
            // ลบ cookie แบบ HttpOnly
            //Response.Cookies.Append("jwt_token", "", new CookieOptions
            //{
            //    HttpOnly = true,
            //    Secure = false,        // ถ้า dev ใช้ http    
            //    SameSite = SameSiteMode.None,
            //    //Expires = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")).AddDays(-10) // กำหนดวันหมดอายุเป็นอดีต → browser ลบ
            //    Expires = DateTime.UtcNow.AddDays(-1)

            //});

            //Response.Cookies.Delete("jwt_token");

            return Ok(new { message = "Logged out" });
        }

        [HttpGet("protected")]
        [Authorize] // ต้องมี JWT cookie
        public IActionResult CheckLogin()
        {
            // User.Identity.Name จะมีค่าถ้า token valid
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            return Ok(new { message = "User is logged in" });
        }

    }

}
