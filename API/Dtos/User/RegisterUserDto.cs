using System.ComponentModel.DataAnnotations;

namespace API.Dtos.User
{

    public record RegisterUserDto
    (

        [Required(ErrorMessage ="The Username is required to register.")]
        [MinLength(8, ErrorMessage ="Username must be atleast 8 characters.")]
        string UserName,
        [Required(ErrorMessage = "The email is required to register.")]
        string Email,
        [Required(ErrorMessage ="The password is required to register.")]
        [MinLength(8, ErrorMessage ="Password must be atleast 8 characters.")]
        string PassWord
    );
}
