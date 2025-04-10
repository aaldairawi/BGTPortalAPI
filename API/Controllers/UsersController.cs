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
        private readonly IUserRoleHelper _userRoleHelper;
        public UsersController(BGTContext context, UserManager<User> userManager, RoleManager<Role> roleManager, IUserRoleHelper userRoleHelper)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _userRoleHelper = userRoleHelper;

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
                user.LastLogin.HasValue ? user.LastLogin.Value.ToString("yyyy-MM-dd hh:mm:ss") : "TBD");
                result.Add(userDto);
            }
            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetOne")]
        public async Task<ActionResult<ExistingUserAppAuthDto>> GetExistingUserAppAuthDtoAsync(string id)
        {

            string lastLoggedInDate = "TBD";

            User? user = await _userManager.FindByIdAsync(id);
            if (user is null || user.UserName is null || user.Email is null) return NotFound(new ProblemDetails { Title = $"User with id {id} does not exist." });

            List<CurrentUserRoleStatusDto> userAssignedRoles = [];
            List<GetRoleDto> appRoles = await GetAppRolesAsync();

            List<string> userAppRoles = await _userRoleHelper.GetUserRolesByUsernameAsync(user.UserName);

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
            WriteLine("Create Users Method Hit");
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

            return new CreatedAtRouteResult("GetOne", new { id = newUser.Id.ToString() }, new ExistingUserAppAuthDto(newUser.Id, newUser.UserName, newUser.Email,
            newUser.RegisteredDate.ToString("yyyy-MM-dd"), "TBD", currentUserRoleStatusList));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUserAsync([FromBody] UpdateUserDto updateUserDto)
        {

            if (!ModelState.IsValid) return BadRequest(new ProblemDetails { Title = "Bad request returned from API" });
            User? user = await _userManager.FindByIdAsync(updateUserDto.UserId);
            if (user is null) return NotFound(new ProblemDetails { Title = $"User with id {updateUserDto.UserId} doesn't exist" });

            for (int index = 0; index < updateUserDto.Roles.Count; index++)
            {
                bool isRoleAssignedToUser = await _userRoleHelper.IsRoleAssignedToUser(user!, updateUserDto.Roles[index].Role!);
                // Add user to role first.
                if (!isRoleAssignedToUser && updateUserDto.Roles[index].Status)
                {
                    var addedUserToRoleResult = await _userRoleHelper.AddUserToRole(user, updateUserDto.Roles[index].Role);
                    if (!addedUserToRoleResult)
                        return BadRequest(new ProblemDetails { Title = $"Error adding {user.UserName} to {updateUserDto.Roles[index].Role}" });
                }
                // Remove user from role.
                else if (isRoleAssignedToUser && !updateUserDto.Roles[index].Status)
                {
                    var removeUserFromResult = await _userRoleHelper.RemoveUserFromRole(user, updateUserDto.Roles[index].Role);
                    if (!removeUserFromResult)
                        return BadRequest(new ProblemDetails { Title = $"Error removing {user.UserName} from {updateUserDto.Roles[index].Role}" });
                }
                else if (isRoleAssignedToUser && updateUserDto.Roles[index].Status)
                    continue;
            }
            if (string.IsNullOrEmpty(updateUserDto.Password)) return NoContent();

            var passwordUpdateResult = await UpdateUserPasswordAsync(user, updateUserDto.Password);

            if (!passwordUpdateResult)
                return BadRequest(new ProblemDetails { Title = $"Error updating password for {user.UserName}" });

            return NoContent();
        }

        private async Task<bool> UpdateUserPasswordAsync(User user, string newPassword)
        {
            IdentityResult removePasswordResult = await _userManager.RemovePasswordAsync(user);
            if (!removePasswordResult.Succeeded) return false;

            IdentityResult addedNewPasswordResult = await _userManager.AddPasswordAsync(user, newPassword);
            return addedNewPasswordResult.Succeeded;

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

        private async Task<List<GetRoleDto>> GetAppRolesAsync() => await _roleManager.Roles.Select(element => new GetRoleDto(element.Id, element.Name!, element.NormalizedName!)).ToListAsync();


    }
}