using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
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
    public class MovementController : ControllerBase
    {

        private readonly AppDbContext _db;

        public MovementController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public ActionResult<IEnumerable<ResponseMovementDto>> GetMovements()
        {
            var movements = _db.Movements.AsNoTracking().Select( m => new ResponseMovementDto
            {
                id = m.Id,
                movementType = m.Type,
                quantityChange = m.Quatity_change,
                date = m.Date,
                productId = m.ProductId,
                supplierId = m.SupplierId
            }).ToList();
            return Ok(movements);
        }

        [HttpGet("Item/{productId}")]
        public ActionResult<IEnumerable<ResponseMovementDto>> GetMovementByItemId(int productId)
        {   
            
            var movements = _db.Movements.AsNoTracking().Where(m => m.ProductId == productId).Select( m => new ResponseMovementDto
            {
                id = m.Id,
                movementType = m.Type,
                quantityChange = m.Quatity_change,
                date = m.Date,
                productId = m.ProductId,
                supplierId = m.SupplierId
            }
                ).ToList();
            if (!movements.Any())
                return NotFound(new { message = "Product not found or No movement history" });

            return Ok(movements);
        }

        //[HttpPost]
        //public ActionResult<string> CreateMovement([FromBody] Movement movement)
        //{
        //    if (movement == null)
        //        return BadRequest("Movement data is required.");
        //    if(!Enum.IsDefined(typeof(MovementType), movement.Type))
        //        return Conflict("Invalid Movement Type.");
        //    movement.Id = Movements.Count > 0 ? Movements.Max(m => m.Id) + 1 : 1;
        //    Movements.Add(movement);

        //    return CreatedAtAction(nameof(GetMovements), new { Id = movement.Id }, movement);

        //}

        //[HttpPut("{Id}")]
        //public ActionResult UpdateMovement(int Id, [FromBody] Movement updatedMovement)
        //{
        //    if (updatedMovement == null)
        //        return BadRequest("Movement data is required.");
        //    var movement = Movements.FirstOrDefault(m => m.Id == Id);
        //    if (movement == null)
        //        return NotFound();
        //    movement.Type = updatedMovement.Type;
        //    movement.Quatity_change = updatedMovement.Quatity_change;
        //    movement.ProductId = updatedMovement.ProductId;
        //    movement.SupplierId = updatedMovement.SupplierId;

        //    return CreatedAtAction(nameof(GetMovements), new { Id = movement.Id }, movement);

        //}

        //[HttpDelete("{Id}")]
        //public ActionResult DeleteMovement(int Id)
        //{
        //    var movement = Movements.FirstOrDefault(m => m.Id == Id);
        //    if (movement == null)
        //        return NotFound();
        //    Movements.Remove(movement);
        //    return Content("delete " + Id + " success");
        //}
    }
}
