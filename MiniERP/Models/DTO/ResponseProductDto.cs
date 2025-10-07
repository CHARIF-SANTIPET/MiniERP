namespace MiniERP.Models.DTO
{
    public class ResponseProductDto
    {
        public int id { get; set; }
        public string name { get; set; }
        public string sku { get; set; }
        public int quantity { get; set; }
        public decimal costPrice { get; set; }
        public decimal salePrice { get; set; }
        public int categoryId { get; set; }
        public int supplierId { get; set; }
        public DateTime createAt { get; set; }
        public DateTime updateAt { get; set; }

    }
}
