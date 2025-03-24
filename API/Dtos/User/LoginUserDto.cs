using System.ComponentModel.DataAnnotations;

namespace API.Dtos.User
{
    public record LoginUserDto([MinLength(8, ErrorMessage = "Username length must be atleast 8 characters.")] string UserName, [MinLength(8, ErrorMessage = "Password length must be atleast 8 characters")] string Password);
}