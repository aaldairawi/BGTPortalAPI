using System.ComponentModel.DataAnnotations;

namespace API.Dtos.User
{
    public record LoginUserDto([Required, MinLength(8, ErrorMessage = "Usernamemust be atleast 8 characters.")] string UserName, 
                                [Required, MinLength(8, ErrorMessage = "Password must be atleast 8 characters")] string Password);
}