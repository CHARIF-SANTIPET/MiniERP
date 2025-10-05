namespace MiniERP.Models.DTO
{
    public class ResponseMovementDto
    {
        public int id { get; set; }
        public MovementType movementType { get; set; }
        public int quantityChange { get; set; }
        public DateTime date { get; set; }
        public int productId { get; set; }
        public int supplierId { get; set; }

    }
}
