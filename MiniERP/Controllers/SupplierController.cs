using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniERP.Data;
using MiniERP.Models;
using MiniERP.Models.DTO;

namespace MiniERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
	[Authorize]
    public class SupplierController : ControllerBase
    {

        private readonly AppDbContext _db;

        public SupplierController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ResponseSupplierDto>> GetSuppliers()
        {
            var suppliers = _db.Suppliers.Select(s => new ResponseSupplierDto
			{
				id = s.Id,
				Name = s.Name,
				Contact_person = s.Contact_person,
				Phone_number = s.Phone_number,
				createAt = s.CreatedAt,
				updateAt = s.UpdatedAt
			}).ToList();
            return suppliers;

		}

        [HttpGet("{Id}")]
        public ActionResult<ResponseSupplierDto> GetSupplierById(int Id)
        {
            var Supplier = _db.Suppliers.FirstOrDefault(s => s.Id == Id);
            if (Supplier == null)
                return NotFound( new {message = "Category not found." } );

			ResponseSupplierDto response = new ResponseSupplierDto
			{
				id = Supplier.Id,
				Name = Supplier.Name,
				Contact_person = Supplier.Contact_person,
				Phone_number = Supplier.Phone_number,
				createAt = Supplier.CreatedAt,
				updateAt = Supplier.UpdatedAt
			};
            return response;

		}

        [HttpPost]
        [Authorize(Roles = "Admin,Warehouse")]
        public ActionResult<ResponseSupplierDto> CreateSupplier([FromBody] UpdateSupplierDto request)
        {

			if (request == null)
				return BadRequest("Supplier data is required.");

			var existingSupplier = _db.Suppliers.FirstOrDefault(s => s.Name == request.Name);

			if (existingSupplier != null)
			{
				return Conflict(new { message = "Supplier name already exists." });
			}

			Supplier newSupplier = new Supplier
			{
				Name = request.Name,
				Contact_person = request.Contact_person,
				Phone_number = request.Phone_number,
            };

			_db.Suppliers.Add(newSupplier);

			_db.SaveChanges();

			return Ok(new { message = "Add supplier succesful" });
		}

        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin,Warehouse")]
        public IActionResult UpdateSupplier(int Id, [FromBody] UpdateSupplierDto updatedSupplier)
        {
            var existingSupplier = _db.Suppliers.FirstOrDefault(s => s.Id == Id);
            if (existingSupplier == null)
				return NotFound(new { message = "Supplier not found." });
			// Check for duplicate Name
			if (_db.Suppliers.Any(c => c.Name == updatedSupplier.Name && c.Id != Id))
				return Conflict(new { message = "Supplier name already exists." });

            existingSupplier.Name = updatedSupplier.Name;
            existingSupplier.Phone_number = updatedSupplier.Phone_number;
            existingSupplier.Contact_person = updatedSupplier.Contact_person;
            existingSupplier.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));

            _db.SaveChanges();

			return NoContent();
		}

		[HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Warehouse")]
        public IActionResult DeleteSupplier(int id)
		{
			var existingSupplier = _db.Suppliers.FirstOrDefault(s => s.Id == id);
			if (existingSupplier == null)
				return NotFound(new { message = "Supplier not found." });

			_db.Suppliers.Remove(existingSupplier);
			_db.SaveChanges(); 

			return NoContent(); 
		}
	}
}
