using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.Data;
using MiniERP.Models;
using MiniERP.Models.DTO;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;



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
        public async Task<ActionResult<IEnumerable<ResponseMovementDto>>> GetMovements()
        {
            var movements = await _db.Movements
                .Include(m => m.Product)
                .Include(m => m.Supplier)
                .Include(m => m.Employee)
                .Select(m => new ResponseMovementDto
                {
                    id = m.Id,
                    movementType = m.Type.ToString(),
                    quantityChange = m.Quatity_change,
                    date = m.Date,
                    ProductName = m.Product.Name,
                    SupplierName = m.Supplier.Name,
                    EmployeeName = m.Employee != null ? m.Employee.username : "",
                    Note = m.Note,
                    Customer = m.Customer
                }).ToListAsync();

            return Ok(movements);
        }

        [HttpGet("Item/{productId}")]
        public async Task<ActionResult<IEnumerable<ResponseMovementDto>>> GetMovementByItemId(int productId)
        {

            var movements = await _db.Movements
                 .Include(m => m.Product)
                 .Include(m => m.Supplier)
                 .Include(m => m.Employee)
                 .Select(m => new ResponseMovementDto
                 {
                     id = m.Id,
                     movementType = m.Type.ToString(),
                     quantityChange = m.Quatity_change,
                     date = m.Date,
                     ProductName = m.Product.Name,
                     SupplierName = m.Supplier.Name,
                     EmployeeName = m.Employee != null ? m.Employee.username : "",
                     Note = m.Note,
                     Customer = m.Customer
                 }).ToListAsync();
            if (!movements.Any())
                return NotFound(new { message = "Product not found or No movement history" });

            return Ok(movements);
        }

        //[HttpGet("export-pdf")]
        //public IActionResult ExportMovementsToPDF()
        //{
        //    var movements = _db.Movements
        //        .Include(m => m.Product)
        //        .Include(m => m.Supplier)
        //        .Include(m => m.Employee)
        //        .ToList();

        //    var document = Document.Create(container =>
        //    {
        //        container.Page(page =>
        //        {
        //            page.Size(PageSizes.A4.Landscape());
        //            page.Margin(2, Unit.Centimetre);

        //            // Header
        //            page.Header().Text("Stock Movement Report")
        //                .FontSize(20).Bold().AlignCenter();

        //            // Content
        //            page.Content().Column(column =>
        //            {
        //                column.Item().Text($"Generated: {DateTime.Now:yyyy-MM-dd HH:mm}")
        //                    .FontSize(10);

        //                column.Item().PaddingVertical(10);

        //                // Table
        //                column.Item().Table(table =>
        //                {
        //                    table.ColumnsDefinition(columns =>
        //                    {
        //                        columns.RelativeColumn();
        //                        columns.RelativeColumn();
        //                        columns.RelativeColumn();
        //                        columns.RelativeColumn();
        //                        columns.RelativeColumn();
        //                        columns.RelativeColumn();
        //                    });

        //                    // Header
        //                    table.Header(header =>
        //                    {
        //                        header.Cell().Background(Colors.Blue.Medium)
        //                            .Padding(5).Text("Product").FontColor(Colors.White);
        //                        header.Cell().Background(Colors.Blue.Medium)
        //                            .Padding(5).Text("Type").FontColor(Colors.White);
        //                        header.Cell().Background(Colors.Blue.Medium)
        //                            .Padding(5).Text("Quantity").FontColor(Colors.White);
        //                        header.Cell().Background(Colors.Blue.Medium)
        //                            .Padding(5).Text("Date").FontColor(Colors.White);
        //                        header.Cell().Background(Colors.Blue.Medium)
        //                            .Padding(5).Text("Employee").FontColor(Colors.White);
        //                        header.Cell().Background(Colors.Blue.Medium)
        //                            .Padding(5).Text("Supplier").FontColor(Colors.White);
        //                    });

        //                    // Body
        //                    foreach (var m in movements)
        //                    {
        //                        table.Cell().Padding(5).Text(m.Product.Name);
        //                        table.Cell().Padding(5).Text(m.Type.ToString());
        //                        table.Cell().Padding(5).Text(m.Quatity_change.ToString());
        //                        table.Cell().Padding(5).Text(m.Date.ToString("yyyy-MM-dd"));
        //                        table.Cell().Padding(5).Text(m.Employee?.username ?? "N/A");
        //                        table.Cell().Padding(5).Text(m.Supplier?.Name ?? "N/A");
        //                    }
        //                });
        //            });

        //            // Footer
        //            page.Footer()
        //                .AlignCenter()
        //                .Text(x =>
        //                {
        //                    x.Span("Page ");
        //                    x.CurrentPageNumber();
        //                });
        //        });
        //    });

        //    var pdf = document.GeneratePdf();
        //    return File(pdf, "application/pdf", $"stock-movement-{DateTime.Now:yyyy-MM-dd}.pdf");
        //}

    }
}
