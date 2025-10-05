using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using MiniERP.Models;

namespace MiniERP.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<Movement> Movements { get; set; } = null!;

        public DbSet<User> User { get; set; } = null!;
        public DbSet<UserProfile> UserProfile { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Supplier)
                .WithMany()
                .HasForeignKey(p => p.Supplier_Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movement>()
                .HasOne(m => m.Product)
                .WithMany()
                .HasForeignKey(m => m.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Movement>()
                .HasOne(m => m.Supplier)
                .WithMany()
                .HasForeignKey(m => m.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasIndex(p => p.Sku)
                .IsUnique();
            modelBuilder.Entity<Product>()
                .Property(p => p.Cost_price)
                .HasPrecision(18, 2);
            modelBuilder.Entity<Product>()
                .Property(p => p.Sale_price)
                .HasPrecision(18, 2);
        }
    }
}
