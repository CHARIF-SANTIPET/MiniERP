using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace MiniERP.Models
{
    public class User
    {
        public int id { get; set; }
        public required string username { get; set; }
        [JsonIgnore]
        public  required string passwordHash { get; set; }
        [JsonIgnore]
        public  required string passwordSalt { get; set; }
        public required string email { get; set; }
        public bool isActive { get; set; }
        public DateTime lastLogin { get; set; }
        public DateTime createAt { get; set; }
        public DateTime updateAt { get; set; }
        public DateTime? deleteAt { get; set; }
    }
}
