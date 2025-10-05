namespace MiniERP.Models.DTO
{
    public class CreateProductRequest
    {
        public required UpdateProductDto product { get; set; }
        public required string Sku { get; set; }
        public required int Quantity { get; set; }

    }
}
