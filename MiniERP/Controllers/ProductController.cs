using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.Data;
using MiniERP.Models;
using MiniERP.Models.DTO;


namespace MiniERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ProductController(AppDbContext db)
        {
            _db = db;

        }
       

        [HttpGet]
        public  ActionResult<IEnumerable<ResponseProductDto>> GetProducts()
        {
            var products = _db.Products.Where(p => !p.IsDeleted).Select(p => new ResponseProductDto
            {
                id = p.Id,
                name = p.Name,
                sku = p.Sku,
                quantity = p.Quantity,
                costPrice = p.Cost_price,
                salePrice = p.Sale_price,
                categoryId = p.CategoryId,
                supplierId = p.Supplier_Id,
                createAt = p.CreatedAt,
                updateAt = p.UpdatedAt

            }).ToList();

            //var products = _db.Products.Include(p => p.Category).Include(p => p.Supplier).ToList();
            return products;
        }

        [HttpGet("{Id}")]
        public ActionResult<ResponseProductDto> GetProductById(int Id)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == Id);
            if (product == null)
                return NotFound(new { message = "Category not found." });

            if (product.IsDeleted)
                return Conflict(new { message = "Product already delete" });

            ResponseProductDto response = new ResponseProductDto
            {
                id = product.Id,
                name = product.Name,
                quantity = product.Quantity,
                costPrice = product.Cost_price,
                salePrice = product.Sale_price,
                categoryId = product.CategoryId,
                supplierId = product.Supplier_Id,
                createAt = product.CreatedAt,
                updateAt = product.UpdatedAt,
                sku = product.Sku
                   
            };
            return response;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Warehouse")]
        public ActionResult<ResponseProductDto> CreateProduct([FromBody] CreateProductRequest request)
        {
            if (request == null)
                return BadRequest("Create data is required.");


            var existSupplier = _db.Suppliers.Find(request.product.SupplierId);
            if (existSupplier == null)
                return NotFound(new { message = "Supplier not found." });

            var employeeId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(employeeId))
                return Unauthorized("Invalid token");

            var existingProduct = _db.Products.FirstOrDefault(p => p.Name == request.product.Name || p.Sku == request.Sku);

            if (existingProduct != null)
            {
                if (existingProduct.Name == request.product.Name)
                    return Conflict(new { message = "Product name already exists." });
                else if (existingProduct.Sku == request.Sku)
                    return Conflict(new { message = "Product SKU already exists." });
            }

            if (request.Quantity < 0)
                return Conflict(new { message = "Quantity can't be negative number" });

            Product newProduct = new Product
            {
                Name = request.product.Name,
                Sku = request.Sku,
                Quantity = request.Quantity,
                Cost_price = request.product.CostPrice,
                Sale_price = request.product.SalePrice,
                CategoryId = request.product.CategoryId,
                Supplier_Id = request.product.SupplierId,

            };

            _db.Products.Add(newProduct);
            _db.SaveChanges();

            var newMovement = new Movement
            {
                Type = MovementType.Purchase,
                Quatity_change = newProduct.Quantity,
                ProductId = newProduct.Id,
                SupplierId = newProduct.Supplier_Id,
                Date = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")),
                EmployeeId = int.Parse(employeeId),
            };

            _db.Movements.Add(newMovement);
            _db.SaveChanges();

            return CreatedAtAction(
                nameof(GetProductById),
                new { id = newProduct.Id },
                new ResponseProductDto  // ใช้ DTO แทน
                {
                    id = newProduct.Id,
                    name = newProduct.Name,
                    sku = newProduct.Sku,
                    quantity = newProduct.Quantity,
                    costPrice = newProduct.Cost_price,
                    salePrice = newProduct.Sale_price,
                    categoryId = newProduct.CategoryId,
                    supplierId = newProduct.Supplier_Id
                }
            );
        }


        // Admin อัพเดทสินค้า
        [HttpPut("{Id}")]
        [Authorize(Roles = "Admin,Warehouse")]
        public IActionResult UpdateProduct(int Id, [FromBody] UpdateProductDto updatedProduct)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == Id);


            if (product == null)
                return NotFound(new { message = "Product not found." });

            if (_db.Products.Any(p => p.Name == updatedProduct.Name))
                return Conflict(new { message = "Product name already exists." });

            product.Name = updatedProduct.Name;
            product.Cost_price = updatedProduct.CostPrice;
            product.Sale_price = updatedProduct.SalePrice;
            product.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(
                                    DateTime.UtcNow,
                                    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
                                );

            _db.SaveChanges();

            return NoContent(); // 204
        }

        [HttpPatch("{id}")]
        public IActionResult UpdateProductQuantity(int id, int quantity, MovementType movementType)
        {
            var product = _db.Products.FirstOrDefault(p => p.Id == id);
            if( product == null)
                return NotFound(new { message = "Product not found." });
            if( product.Quantity + quantity < 0)
                return Conflict(new { message = "Product quantity not available." });


            product.Quantity += quantity;
            product.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(
                                    DateTime.UtcNow,
                                    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
                                );

            Movement newMovement = new Movement
            {
                Type = movementType,
                Quatity_change = quantity,
                ProductId = product.Id,
                SupplierId = product.Supplier_Id,
                Date = TimeZoneInfo.ConvertTimeFromUtc(
                                    DateTime.UtcNow,
                                    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
                                )
            };
            _db.Movements.Add(newMovement);
            _db.SaveChanges();

            return NoContent(); // 204
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Warehouse")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Product not found." });

            if (product.IsDeleted)
                return Conflict(new { message = "Product already delete" });

            product.IsDeleted = true;
            product.DeleteAt = TimeZoneInfo.ConvertTimeFromUtc(
                                    DateTime.UtcNow,
                                    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
                                );

            var employeeIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(employeeIdClaim, out int employeeId))
            {
                return Unauthorized(new { message = "Invalid EmployeeId in token." });
            }
            Movement newMovement = new Movement
            {
                Type = MovementType.Delete,
                Quatity_change = -product.Quantity,
                ProductId = product.Id,
                Date = TimeZoneInfo.ConvertTimeFromUtc(
                                    DateTime.UtcNow,
                                    TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
                                ),
                EmployeeId = employeeId,    
            };

            _db.Movements.Add(newMovement);
            _db.SaveChanges();
            

            return Ok(new { message = "Delete succesful." }); 
        }

    }
}
