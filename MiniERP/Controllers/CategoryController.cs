using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.Data;
using MiniERP.Models;
using MiniERP.Models.DTO;

namespace MiniERP.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {

        private readonly AppDbContext _db;

        public CategoryController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ResponseCategory>> GetCategories()
        {
            var categories_db = _db.Categories
                .Select(c => new ResponseCategory
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToList();


            return categories_db;
        }

        [HttpGet("{Id}")]
        public ActionResult<ResponseCategory> GetCategoryById(int Id)
        {
            var category_db = _db.Categories.FirstOrDefault(c => c.Id == Id);
            if (category_db == null)
                return NotFound(new { message = "Category not found." });
            var response = new ResponseCategory
            {
                Id = category_db.Id,
                Name = category_db.Name,
                CreatedAt = category_db.CreatedAt,
                UpdatedAt = category_db.UpdatedAt
            };

            return Ok(response);
        }

        [HttpPost]
        public ActionResult<ResponseCategory> CreateCategory([FromBody] string newCategoryName)
        {
            if (newCategoryName == null)
                return BadRequest("Category Name is required.");

            var existing_category = _db.Categories.Where(c => c.Name == newCategoryName).FirstOrDefault();

            if (existing_category != null)
            {
                return Conflict("Category Name already exists.");
            }

            Category newCategory = new Category
            {
                Name = newCategoryName,
            };
            _db.Categories.Add(newCategory);

            _db.SaveChanges();

            return CreatedAtAction(
                   nameof(GetCategoryById),           
                   new { id = newCategory.Id },
                   newCategory
               );
        }

        [HttpPut("{Id}")]
        public IActionResult UpdateCateory(int Id, [FromBody] string newCategoryName)
        {

            var exixting_category = _db.Categories.FirstOrDefault(c => c.Id == Id);
            if (exixting_category == null)
                return NotFound(new { message = "Category not found." });

            if(_db.Categories.Any(c => c.Name == newCategoryName && c.Id != Id))
                return Conflict("Category Name already exists.");

            exixting_category.Name = newCategoryName;
            exixting_category.UpdatedAt = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"));
        
            _db.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{Id}")]
        public IActionResult DeleteCategory(int Id)
        {
            var existingCategory = _db.Categories.FirstOrDefault(c => c.Id == Id);
            if (existingCategory == null)
                return NotFound(new { message = "Category not found." });

            _db.Categories.Remove(existingCategory);
            _db.SaveChanges();
            return NoContent();
        }
    }
}
