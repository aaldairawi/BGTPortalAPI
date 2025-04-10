
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public class UserRoleHelperRepository : IUserRoleHelper
    {



        private readonly UserManager<User> _userManager;

        public UserRoleHelperRepository(UserManager<User> userManager)
        {
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }

        /// <summary>
        /// Adds a User to the role that is passed in as an argument.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="role"></param>
        /// <returns>True if the operation was successful otherwise false.</returns>
        public async Task<bool> AddUserToRole(User user, string role)
        {
            IdentityResult assignRoleToUserResult = await _userManager.AddToRoleAsync(user, role);
            return assignRoleToUserResult.Succeeded;
        }
        /// <summary>
        /// Removes a user from the role that is passed in as an argument.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="roleToRemove"></param>
        /// <returns>True if the operation was successful otherwise false.</returns>
        public async Task<bool> RemoveUserFromRole(User user, string roleToRemove)
        {
            IdentityResult removedRoleResult = await _userManager.RemoveFromRoleAsync(user!, roleToRemove);
            return removedRoleResult.Succeeded;
        }

        /// <summary>
        /// Checks if the user is assigned the role.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="roleName"></param>
        /// <returns>A boolean , true if the user is assigned the role, false otherwise.</returns>
        public async Task<bool> IsRoleAssignedToUser(User user, string roleName)
        {
            return await _userManager.IsInRoleAsync(user, roleName);
        }


        public async Task<List<string>> GetUserRolesByUsernameAsync(string username)
        {
            User?  user = await _userManager.FindByNameAsync(username);            
            return (List<string>)await _userManager.GetRolesAsync(user!);
        }


    }
}