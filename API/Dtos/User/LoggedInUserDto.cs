namespace API.Dtos.User
{
    public record  LoggedInUserDto(string Id, string UserName, string Email , string Token );
}