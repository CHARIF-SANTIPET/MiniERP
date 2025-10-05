using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace MiniERP.Models
{
    public enum UserRole
    {
        Admin,
        Warehouse,
        salesman,
        Employees,
    }
    public class User : BaseEntity 
    {
        public required string username { get; set; }
        [JsonIgnore]
        public  required string passwordHash { get; set; }
        [JsonIgnore]
        public  required string passwordSalt { get; set; }
        public required string email { get; set; }
        public bool isActive { get; set; }
        public UserRole Role { get; set; } = UserRole.Employees;
        public DateTime lastLogin { get; set; }
    }
}
