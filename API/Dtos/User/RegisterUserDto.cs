using System.ComponentModel.DataAnnotations;

namespace API.Dtos.User
{

    public record RegisterUserDto
    (

        [Required(ErrorMessage ="Username is required.")]
        [MinLength(8, ErrorMessage ="Username must be atleast 8 characters.")]
        string UserName,
        [Required(ErrorMessage = "Email is required.")]
        string Email,
        [Required(ErrorMessage ="Password is required.")]
        [MinLength(8, ErrorMessage ="Password must be atleast 8 characters.")]
        string PassWord
    );
}
