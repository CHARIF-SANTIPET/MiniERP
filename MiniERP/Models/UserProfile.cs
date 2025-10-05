namespace MiniERP.Models
{
    public class UserProfile : BaseEntity
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public decimal? Salary { get; set; }
        public string? position { get; set; }
        public string? department { get; set; }
        public string? gender { get; set; }
        public string? birthday { get; set; }
        public string? description { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime HireDate { get; set; }
        public DateTime EndDate { get; set; }

        public User User { get; set; }
    }
}
