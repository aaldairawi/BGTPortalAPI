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
                await userManager.CreateAsync(rohit, "Rneel@3135");
                await userManager.AddToRolesAsync(rohit, ["Admin"]);

                var migs = new User
                {
                    UserName = "mcortez",
                    Email = "mcortez@bgt.ictis.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(migs, "Manager@3135");
                await userManager.AddToRolesAsync(migs, ["Admin"]);


                var yash = new User
                {
                    UserName = "yagnihotri",
                    Email = "yagnihotri@bgt.ictsi.com",
                    RegisteredDate = DateTime.UtcNow,
                };
                await userManager.CreateAsync(yash, "Argo@3135");
                await userManager.AddToRolesAsync(yash, ["DubaiFinance"]);

                var strippingaccount
                 = new User
                 {
                     UserName = "strippingaccount",
                     Email = "strippingaccount@bgt.ictsi.com",
                     RegisteredDate = DateTime.UtcNow,
                 };

                await userManager.CreateAsync(strippingaccount, "Strip@3135");
                await userManager.AddToRolesAsync(strippingaccount, ["Operations"]);
                var ceo = new User
                {
                    UserName = "romeo",
                    Email = "rsalvador@bgt.ictsi.com",
                    RegisteredDate = DateTime.UtcNow,
                };

                await userManager.CreateAsync(ceo, "Romeo@3135");
                await userManager.AddToRolesAsync(ceo, ["Admin"]);


                var mqassim = new User
                {
                    UserName = "mqassim",
                    Email = "mqassim@bgt.ictsi.com",
                    RegisteredDate = DateTime.UtcNow,
                };

                await userManager.CreateAsync(mqassim, "Masan@3135");
                await userManager.AddToRolesAsync(mqassim, ["Operations"]);

                var jamil = new User
                {
                    UserName = "jamil",
                    Email = "jamil@bgt.ictsi.com",
                    RegisteredDate = DateTime.UtcNow,
                };

                await userManager.CreateAsync(jamil, "Jasan@3135");
                await userManager.AddToRolesAsync(jamil, ["Operations"]);


                WriteLine("Database seeded succesfully.");

            }
        }
    }
}