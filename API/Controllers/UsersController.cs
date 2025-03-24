using API.Data;
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

        public UsersController(BGTContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
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
                user.RegisteredDate.HasValue ? user.RegisteredDate.ToString()! : "TBD",
                user.LastLogin.HasValue ? user.LastLogin.ToString()! : "TBD", await GetUserRolesByUsername(user.UserName!));
                result.Add(userDto);
            }
            return Ok(result);
        }


        [HttpGet("{id}", Name = "GetOne")]
        public async Task<ActionResult<UserDto>> GetOne(string id)
        {
            User? user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new ProblemDetails { Title = $"A problem occured fetching this user with id {id}." });
            }
            UserDto result = new(user.Id, user.UserName!, user.Email!, user.RegisteredDate.ToString() ?? "", user.LastLogin.ToString() ?? "TBD", await GetUserRolesByUsername(user.UserName!));
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(RegisterUserDto registerUserDto)
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
            return CreatedAtRoute("GetOne", new { id = newUser.Id }, new UserDto(newUser.Id, newUser.UserName, newUser.Email, newUser.RegisteredDate.ToString() ?? "",
            newUser.LastLogin.ToString() ?? "TBD", await GetUserRolesByUsername(newUser.UserName)));
        }


        [HttpPut("{id}")] // Make it to x and y,
        public async Task<ActionResult<UserDto>> UpdateUserAsync(string id, [FromBody] UpdateUserDto updateUserDto)
        {
            if (!ModelState.IsValid) return BadRequest(new ProblemDetails { Title = "Bad request returned from API" });
            User? user = await _userManager.FindByIdAsync(id);
            if (user is null) return NotFound(new ProblemDetails { Title = $"User with id {id} doesn't exist" });

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
            UserDto result = new(user.Id, user.UserName!, user.Email!, user.RegisteredDate.ToString() ?? "TBD", user.LastLogin.ToString() ?? "TBD", await GetUserRolesByUsername(user.UserName!));
            return Ok(result);
        }

        private async Task<string> UpdateUserPasswordAsync(User user, UpdatePasswordDto updatePasswordDto)
        {
            if (!string.IsNullOrEmpty(updatePasswordDto.NewPassword))
            {
                IdentityResult removePasswordResult = await _userManager.RemovePasswordAsync(user);
                if (!removePasswordResult.Succeeded)
                {
                    return "Error with removing the password.";
                }
                IdentityResult addedNewPasswordResult = await _userManager.AddPasswordAsync(user, updatePasswordDto.NewPassword);
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
        private async Task<List<string>> GetUserRolesByUsername(string username)
        {
            User? user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                throw new Exception($"User with username {username} does not exist, attempting to retrieve roles.");
            }
            return (List<string>)await _userManager.GetRolesAsync(user);


        }

        private async Task<bool> IsRoleAssigned(User user, string roleName)
        {
            return await _userManager.IsInRoleAsync(user, roleName);
        }


    }
}