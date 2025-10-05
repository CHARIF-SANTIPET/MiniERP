using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniERP.Data;
using MiniERP.Models;
using Microsoft.EntityFrameworkCore;

namespace MiniERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UserProfileController(AppDbContext db)
        {
            _db = db;
        }

        // ✅ Get UserProfile by Id
        [HttpGet("{id}")]
        public IActionResult GetProfile(int id)
        {
            var profile = _db.UserProfiles.Include(up => up.User)
                                          .FirstOrDefault(up => up.Id == id);
            if (profile == null) return NotFound();

            return Ok(new
            {
                profile.Id,
                profile.UserId,
                profile.User.username,
                profile.FirstName,
                profile.LastName,
                profile.Email,
                profile.PhoneNumber,
                profile.Address,
                profile.Salary,
                profile.position,
                profile.department,
                profile.gender,
                profile.birthday,
                profile.description,
                profile.AvatarUrl,
                profile.HireDate,
                profile.EndDate,
                profile.CreatedAt,
                profile.UpdatedAt
            });
        }


        // ✅ Update UserProfile
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateProfile(int id, UserProfile updatedProfile)
        {
            var profile = _db.UserProfiles.FirstOrDefault(up => up.Id == id);
            if (profile == null) return NotFound();

            // อัพเดตฟิลด์ที่ต้องการ
            profile.FirstName = updatedProfile.FirstName;
            profile.LastName = updatedProfile.LastName;
            profile.Email = updatedProfile.Email;
            profile.PhoneNumber = updatedProfile.PhoneNumber;
            profile.Address = updatedProfile.Address;
            profile.Salary = updatedProfile.Salary;
            profile.position = updatedProfile.position;
            profile.department = updatedProfile.department;
            profile.gender = updatedProfile.gender;
            profile.birthday = updatedProfile.birthday;
            profile.description = updatedProfile.description;
            profile.AvatarUrl = updatedProfile.AvatarUrl;
            profile.HireDate = updatedProfile.HireDate;
            profile.EndDate = updatedProfile.EndDate;
            profile.UpdatedAt = DateTime.UtcNow;

            _db.SaveChanges();

            return Ok(new { message = "Profile updated successfully" });
        }

        // ✅ Get Profile by current user
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetMyProfile()
        {
            var username = User.Identity?.Name;
            if (username == null) return Unauthorized();

            var profile = _db.UserProfiles.Include(up => up.User)
                                          .FirstOrDefault(up => up.User.username == username);
            if (profile == null) return NotFound();

            return Ok(new
            {
                profile.Id,
                profile.UserId,
                profile.User.username,
                profile.FirstName,
                profile.LastName,
                profile.Email,
                profile.PhoneNumber,
                profile.Address,
                profile.Salary,
                profile.position,
                profile.department,
                profile.gender,
                profile.birthday,
                profile.description,
                profile.AvatarUrl,
                profile.HireDate,
                profile.EndDate,
                profile.CreatedAt,
                profile.UpdatedAt
            });
        }
    }
}
