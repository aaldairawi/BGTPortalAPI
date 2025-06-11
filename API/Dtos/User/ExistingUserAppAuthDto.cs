
namespace API.Dtos.User
{
    public record ExistingUserAppAuthDto(
    int UserId,
    string Username,
    string Email,
    string Registered,
    string? LastLoggedIn,
    List<CurrentUserRoleStatusDto> Roles
)
    {
        public string PasswordPlaceHolder { get; init; } = "********";
    }

    public record CurrentUserRoleStatusDto(int Id, string Name, string NormalizedName, bool Status);
    

}