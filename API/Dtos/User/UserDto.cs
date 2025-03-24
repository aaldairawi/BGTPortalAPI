
namespace API.Dtos.User
{
    public record UserDto(int Id, string UserName, string Email, string Registered, string ? LastLoggedIn, List<string> Roles);


}