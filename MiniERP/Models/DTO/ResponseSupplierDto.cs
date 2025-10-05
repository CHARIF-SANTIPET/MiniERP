namespace MiniERP.Models.DTO
{
    public class ResponseSupplierDto
    {
        public int id { get; set; }
        public required string Name { get; set; }
        public required string Contact_person { get; set; }
        public required string Phone_number { get; set; }
        public DateTime createAt { get; set; }
        public DateTime updateAt { get;set; }

    }
}
