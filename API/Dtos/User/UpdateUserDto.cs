namespace API.Dtos.User
{
    public class UpdateUserDto
    {
        public List<UserRole> Roles { get; set; } = [];

        public required UpdatePasswordDto Password { get; set; }
        public UpdateUserDto()
        {

        }
    }
    public record UserRole( string Role, bool Status);
    public record UpdatePasswordDto(string NewPassword);

}