using API.Data;
using API.Dtos.Role;
using API.Dtos.User;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UsersController : BaseApiController
    {
        private readonly BGTContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public UsersController(BGTContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        [HttpGet("getall")]
        public async Task<ActionResult<List<UserDto>>> GetAll()
        {
            IQueryable<User> usersResultList = _context.Users.Where((user) => user.Id >= 0);
            var users = await usersResultList.ToListAsync();

            List<UserDto> result = [];

            foreach (User user in users)
            {

                UserDto userDto = new(user.Id, user.UserName!, user.Email!,
                 user.RegisteredDate.ToString("yyyy-MM-dd"),
                user.LastLogin.HasValue ? user.LastLogin.Value.ToString("yyyy-MM-dd") : "TBD");
                result.Add(userDto);
            }
            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetOne")]
        public async Task<ActionResult<ExistingUserAppAuthDto>> GetExistingUserAppAuthDtoAsync(string id)
        {
            WriteLine("Yep made it here bud" + id);
            string lastLoggedInDate = "TBD";

            User? user = await _userManager.FindByIdAsync(id);
            if (user is null || user.UserName is null || user.Email is null) return NotFound(new ProblemDetails { Title = $"User with id {id} does not exist." });

            List<CurrentUserRoleStatusDto> userAssignedRoles = [];
            List<GetRoleDto> appRoles = await GetAppRolesAsync();

            List<string> userAppRoles = await GetUserRolesByUsernameAsync(user.UserName);

            foreach (GetRoleDto appRole in appRoles)
            {
                userAssignedRoles.Add(new CurrentUserRoleStatusDto(appRole.Id, appRole.Name, appRole.NormalizedName, userAppRoles.Contains(appRole.Name)));
            }


            if (user.LastLogin is DateTime userLastLoggedInDate)
                lastLoggedInDate = userLastLoggedInDate.ToString("yyyy-MM-dd");

            ExistingUserAppAuthDto result = new(user.Id, user.UserName, user.Email, user.RegisteredDate.ToString("yyyy-MM-dd"),
            lastLoggedInDate, userAssignedRoles);
            return Ok(result);
        }


        [HttpPost]
        public async Task<ActionResult<ExistingUserAppAuthDto>> CreateUser(RegisterUserDto registerUserDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(new ProblemDetails { Title = "Please check your model state." });
            }
            User? user = await _userManager.FindByNameAsync(registerUserDto.UserName);
            if (user != null)
            {
                return BadRequest(new ProblemDetails { Title = $"User with username {registerUserDto.UserName} already exists." });
            }
            User newUser = new()
            {
                UserName = registerUserDto.UserName,
                Email = registerUserDto.Email,
                RegisteredDate = DateTime.Now,
                LastLogin = null,
            };
            await _userManager.CreateAsync(newUser, registerUserDto.PassWord);
            await _userManager.AddToRoleAsync(newUser, "Member");

            var result = await _context.SaveChangesAsync();
            if (result < 0)
            {
                return BadRequest(new ProblemDetails { Title = "A problem occured creating the user in the app." });
            }


            List<GetRoleDto> appRoles = await GetAppRolesAsync();

            List<CurrentUserRoleStatusDto> currentUserRoleStatusList = [];
            foreach (GetRoleDto role in appRoles)
            {
                currentUserRoleStatusList.Add(new(role.Id, role.Name, role.NormalizedName, false));
            }

            return CreatedAtRoute("GetOne", new { id = newUser.Id }, new ExistingUserAppAuthDto(newUser.Id, newUser.UserName, newUser.Email,
            newUser.RegisteredDate.ToString("yyyy-MM-dd"), "TBD", currentUserRoleStatusList));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUserAsync([FromBody] UpdateUserDto updateUserDto)
        {
            WriteLine("User updating method hit");
            if (!ModelState.IsValid) return BadRequest(new ProblemDetails { Title = "Bad request returned from API" });
            User? user = await _userManager.FindByIdAsync(updateUserDto.UserId);
            if (user is null) return NotFound(new ProblemDetails { Title = $"User with id {updateUserDto.UserId} doesn't exist" });

            for (int index = 0; index < updateUserDto.Roles.Count; index++)
            {
                bool isRoleAssignedToUser = await IsRoleAssigned(user!, updateUserDto.Roles[index].Role!);
                // Add user to role first.
                if (!isRoleAssignedToUser && updateUserDto.Roles[index].Status)
                {
                    var addedUserToRoleResult = await AddUserToRole(user, updateUserDto.Roles[index].Role);
                    if (addedUserToRoleResult != "Success")
                        return BadRequest(new ProblemDetails { Title = $"Error adding {user.UserName} to {updateUserDto.Roles[index].Role}" });
                }
                // Remove user from role.
                else if (isRoleAssignedToUser && !updateUserDto.Roles[index].Status)
                {
                    var removeUserFromResult = await RemoveUserRole(user, updateUserDto.Roles[index].Role);
                    if (removeUserFromResult != "Success")
                        return BadRequest(new ProblemDetails { Title = $"Error removing {user.UserName} from {updateUserDto.Roles[index].Role}" });
                }
                else if (isRoleAssignedToUser && updateUserDto.Roles[index].Status)
                    continue;
            }
            var passwordUpdateResult = await UpdateUserPasswordAsync(user, updateUserDto.Password);
            if (passwordUpdateResult != "Success")
                return BadRequest(new ProblemDetails { Title = $"Error updating password for {user.UserName}" });

            return NoContent();
        }

        private async Task<string> UpdateUserPasswordAsync(User user, string newPassword)
        {
            if (!string.IsNullOrEmpty(newPassword))
            {
                IdentityResult removePasswordResult = await _userManager.RemovePasswordAsync(user);
                if (!removePasswordResult.Succeeded)
                {
                    return "Error with removing the password.";
                }
                IdentityResult addedNewPasswordResult = await _userManager.AddPasswordAsync(user, newPassword);
                if (!addedNewPasswordResult.Succeeded)
                {
                    return "Error with assigning the new password.";
                }
            }
            return "Success";
        }

        private async Task<string> AddUserToRole(User user, string role)
        {
            IdentityResult assignRoleToUserResult = await _userManager.AddToRoleAsync(user!, role);
            if (!assignRoleToUserResult.Succeeded)
            {
                return "Error";
            }
            return "Success";
        }
        private async Task<string> RemoveUserRole(User user, string roleToRemove)
        {
            IdentityResult removedRoleResult = await _userManager.RemoveFromRoleAsync(user!, roleToRemove);
            if (!removedRoleResult.Succeeded)
            {
                return "Error";
            }
            return "Success";
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            User? user = await _userManager.FindByIdAsync(id);
            if (user is null)
            {
                return BadRequest(new ProblemDetails { Title = $"User with id {id} doesn't exist" });
            }
            IdentityResult result = await _userManager.DeleteAsync(user!);
            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest("Error occured deleting user.");
        }
        private async Task<List<string>> GetUserRolesByUsernameAsync(string username)
        {
            User? user = await _userManager.FindByNameAsync(username) ?? throw new Exception($"User with username {username} does not exist, attempting to retrieve roles.");
            return (List<string>)await _userManager.GetRolesAsync(user);
        }

        private async Task<List<GetRoleDto>> GetAppRolesAsync() => await _roleManager.Roles.Select(element => new GetRoleDto(element.Id, element.Name!, element.NormalizedName!)).ToListAsync();


        private async Task<bool> IsRoleAssigned(User user, string roleName)
        {
            return await _userManager.IsInRoleAsync(user, roleName);
        }


    }
}