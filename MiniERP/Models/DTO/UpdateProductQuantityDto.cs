namespace MiniERP.Models.DTO
{
    public class UpdateProductQuantityDto
    {
        public required MovementType MovementType { get; set; }
        public int Quatity_change { get; set; }
        public int ProductId { get; set; }
        public int SupplierId { get; set; }
        public int? EmployeeId { get; set; }
        public string Note { get; set; }
        public string Customer { get; set; }
    }
}
