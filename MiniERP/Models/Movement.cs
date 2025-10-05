namespace MiniERP.Models
{

    public enum MovementType
    {
        Purchase,
        Sale,
        Return,
        Transfer,
        Restock
    }
    public class Movement 
    {
        public int Id { get; set; } 
        public required MovementType Type { get; set; }
        public int Quatity_change { get; set; } 
        public DateTime Date { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = null!;

        //public int saleOrderId { get; set; }
        //public SaleOrder SaleOrder { get; set; } = null!;
        //public int employeeId { get; set; }
        //public Employee Employee { get; set; } = null!;
            
        public Movement()
        {
            Date = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
        }

        public Movement(MovementType Type, int Quatity_change, int productId, int supplierId)
        {
            this.Type = Type;
            this.Quatity_change = Quatity_change;
            this.ProductId = productId;
            this.SupplierId = supplierId;
            this.Date = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
        }

    }
}
