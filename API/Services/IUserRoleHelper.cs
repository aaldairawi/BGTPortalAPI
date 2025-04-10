
using API.Entities;

namespace API
{
    public interface  IUserRoleHelper
    {
        Task<bool> AddUserToRole(User user, string role);
        Task<bool> RemoveUserFromRole(User user, string role);
        Task<bool> IsRoleAssignedToUser(User user, string role);
        Task<List<string>> GetUserRolesByUsernameAsync(string username);

    }
}