namespace MiniERP.Models
{
    public class Supplier : BaseEntity
    {
        public required string Name { get; set; }
        public required string Contact_person { get; set; }
        public required string Phone_number { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
