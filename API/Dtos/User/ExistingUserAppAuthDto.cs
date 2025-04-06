
namespace API.Dtos.User
{
    public class ExistingUserAppAuthDto
    {
        public int UserId { get; init; }
        public string Username { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public string Registered { get; init; } = string.Empty;
        public string? LastLoggedIn { get; init; } = string.Empty;

        public List<CurrentUserRoleStatusDto> Roles { get; init; } = [];
        public string PasswordPlaceHolder { get; init; } = "********";

        public ExistingUserAppAuthDto(int userId, string username, string email, string registered, string lastLoggedIn, List<CurrentUserRoleStatusDto> roles)
        {
            UserId = userId;
            Username = username;
            Email = email;
            Registered = registered;
            LastLoggedIn = lastLoggedIn;

            Roles = roles;

        }
        public ExistingUserAppAuthDto()
        {

        }
    }
    public class CurrentUserRoleStatusDto(int id, string name, string normalizedName, bool isRoleAssignedToUser)
    {
        public int Id { get; init; } = id;
        public string Name { get; init; } = name;

        public string NormalizedName { get; init; } = normalizedName;

        public bool Status { get; init; } = isRoleAssignedToUser;

    }

}