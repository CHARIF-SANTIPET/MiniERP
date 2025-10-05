namespace MiniERP.Models.DTO
{
    public class UpdateProductDto
    {
        public string Name { get; set; }
        public decimal CostPrice { get; set; }
        public decimal SalePrice { get; set; }
        public int CategoryId { get; set; }
        public int SupplierId { get;set; }
    }
}
