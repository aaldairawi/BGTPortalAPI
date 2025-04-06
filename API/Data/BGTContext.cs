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
            new Role { Id = 1, Name = "Admin", NormalizedName = "ADMIN" },
            new Role { Id = 2, Name = "DubaiBilling", NormalizedName = "DUBAIBILLING" },
            new Role { Id = 3, Name = "Stripping", NormalizedName = "STRIPPING" },
            new Role { Id = 4, Name = "Billing", NormalizedName = "BILLING" });


        }
    }
}