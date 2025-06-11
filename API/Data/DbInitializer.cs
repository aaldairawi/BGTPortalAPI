using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user1 = new User
                {
                    UserName = "aaldairawi",
                    Email = "aaldairawi@bgt.ictsi.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(user1, "Laser@3135");
                await userManager.AddToRolesAsync(user1, ["Admin"]);

                var ghadeer = new User
                {
                    UserName = "gmohammed",
                    Email = "gmohammed@bgt.ictis.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(ghadeer, "Programmer@3135");
                await userManager.AddToRolesAsync(ghadeer, ["Admin"]);

                var rohit = new User
                {
                    UserName = "rneel",
                    Email = "rneel@bgt.ictis.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(rohit, "Admin@3135");
                await userManager.AddToRolesAsync(rohit, ["Admin"]);

                var migs = new User
                {
                    UserName = "mcortez",
                    Email = "mcortez@bgt.ictis.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(migs, "Manager@3135");
                await userManager.AddToRolesAsync(migs, ["Admin"]);



                var user3 = new User
                {
                    UserName = "yagnihotri",
                    Email = "yagnihotri@bgt.ictsi.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(user3, "Argo@3135");
                await userManager.AddToRolesAsync(user3, ["DubaiFinance"]);

                var user6 = new User
                {
                    UserName = "strippingmember",
                    Email = "strippingmember@bgt.ictsi.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(user6, "Argo@3135");
                await userManager.AddToRolesAsync(user6, ["Operations"]);
                WriteLine("Database seeded succesfully.");

            }
        }
    }
}