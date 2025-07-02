using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class BGTContext(DbContextOptions<BGTContext> options) : IdentityDbContext<User, Role, int>(options)
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
            .Property(user => user.Id)
            .ValueGeneratedOnAdd();

            builder.Entity<InvoiceHeader>()
            .HasOne(h => h.UploadedBy)
            .WithMany()
            .HasForeignKey(h => h.UploadedById)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Role>()
            .HasData(
            new Role { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
            new Role { Id = 2, Name = "DubaiFinance", NormalizedName = "DUBAIFINANCE" },
            new Role { Id = 3, Name = "Operations", NormalizedName = "OPERATIONS" },
            new Role { Id = 4, Name = "IraqFinance", NormalizedName = "IRAQFINANCE" },
            new Role { Id = 5, Name = "IraqBilling", NormalizedName = "IRAQBILLING" },
            new Role { Id = 6, Name = "Guest", NormalizedName = "GUEST" }
            );
        }

        public DbSet<InvoiceHeader> InvoiceHeaders => Set<InvoiceHeader>();

    }

}