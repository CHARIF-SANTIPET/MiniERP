namespace MiniERP.Models.DTO
{
    public class UpdateUserRoleRequest
    {
        public string Username { get; set; } = null!;
        public string Role { get; set; } = null!; // Admin, Warehouse, Salesman, Employees
    }
}
