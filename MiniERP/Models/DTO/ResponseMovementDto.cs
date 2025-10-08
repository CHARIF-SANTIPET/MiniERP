using MiniERP.Migrations;

namespace MiniERP.Models.DTO
{
    public class ResponseMovementDto
    {
        public int id { get; set; }
        public string movementType { get; set; }
        public int quantityChange { get; set; }
        public DateTime date { get; set; }
        public string ProductName { get; set; }
        public string SupplierName { get; set; }
        public string Note { get; set; }
        public string Customer { get; set; }
        public string EmployeeName { get; set; }

    }
}
