namespace MiniERP.Models
{
    public class Product : BaseEntity
    {
        public required string Sku { get; set; }
        public required string Name { get; set; }
        public int Quantity { get; set; }

        public required int CategoryId { get; set; }
        public Category? Category { get; set; }
        public decimal Cost_price { get; set; }
        public decimal Sale_price { get; set; }
        public int Supplier_Id { get; set; }
        public Supplier Supplier { get; set; } = null!;

        public bool IsDeleted { get; set; } = false;
        public DateTime DeleteAt { get; set; }

        public ICollection<Movement> StockMovement { get; set; } = new List<Movement>();
    }
}
