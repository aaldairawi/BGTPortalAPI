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
            builder.Entity<Role>()
            .HasData(
            new Role { Id = 1, Name = "Admin", NormalizedName = "ADMIN" }, // IT.
            new Role { Id = 2, Name = "DubaiBilling", NormalizedName = "DUBAIBILLING" }, // Yash and Syed.
            new Role { Id = 3, Name = "Stripping", NormalizedName = "STRIPPING" }, // Operations yard team.
            new Role { Id = 5, Name = "Billing", NormalizedName = "BILLING" }, // In case of future implementation of Gatepass.
            new Role { Id = 6, Name = "BillingSupervisor", NormalizedName = "BILLINGSUPERVISOR" }); // Marnie and M Gassim.
        }
    }
}