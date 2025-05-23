using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class BGTContext : IdentityDbContext<User, Role, int>
    {
        public BGTContext(DbContextOptions<BGTContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
            .Property(user => user.Id)
            .ValueGeneratedOnAdd();
            
            builder.Entity<Role>()
            .HasData(
            new Role { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
            new Role { Id = 2, Name = "DubaiFinance", NormalizedName = "DUBAIFINANCE" },
            new Role { Id = 3, Name = "Operations", NormalizedName = "OPERATIONS" },
            new Role { Id = 4, Name = "IraqFinance", NormalizedName = "IRAQFINANCE" }, 
            new Role { Id = 5, Name = "IraqBilling", NormalizedName = "IRAQBILLING" },
            new Role { Id = 6, Name= "Guest", NormalizedName="GUEST" }
            );
        }
    }

}