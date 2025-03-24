using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public DateTime? RegisteredDate { get; set; }
        public DateTime? LastLogin { get; set; }

    }
}