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
                    Email = "aaldairawi@ictsiiraq.com",
                    RegisteredDate = DateTime.Now,
                };
                await userManager.CreateAsync(user1, "Argo@3135");
                await userManager.AddToRolesAsync(user1, ["Admin"]);

                var user3 = new User
                {
                    UserName = "yagnihotri",
                    Email = "yagnihotri@bgt.ictsi.com",
                    RegisteredDate = DateTime.Now,
                };
                await userManager.CreateAsync(user3, "Argo@3135");
                await userManager.AddToRolesAsync(user3, ["DubaiBilling"]);

                var user6 = new User
                {
                    UserName = "strippingmember",
                    Email = "strippingmember@bgt.ictsi.com",
                    RegisteredDate = DateTime.Now,
                };
                await userManager.CreateAsync(user6, "Argo@3135");
                await userManager.AddToRolesAsync(user6, ["Stripping"]);

                WriteLine("Database seeded succesfully.");

            }

        }



    }

}