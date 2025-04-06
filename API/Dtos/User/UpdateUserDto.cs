namespace API.Dtos.User
{
    public class UpdateUserDto
    {
        public string  UserId {get; set;} = string.Empty; 
        public List<UserRole> Roles { get; set; } = [];

        public string  Password { get; set; } = string.Empty;
        

    }
    public record UserRole( string Role, bool Status);
    

}