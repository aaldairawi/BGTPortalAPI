using API.Data;
using API.Dtos.User;
using API.Entities;
using API.Services.Token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // [ApiVersion("1.0")]
    public class AccountController : BaseApiController
    {
        private readonly TokenService _tokenService;
        private readonly UserManager<User> _userManager;
        private readonly BGTContext _bgtContext;

        public AccountController(TokenService tokenService, UserManager<User> userManager, BGTContext bGTContext)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _bgtContext = bGTContext;
        }
        [HttpPost("login")]
        public async Task<ActionResult<LoggedInUserDto>> Login(LoginUserDto loginUserDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(new ProblemDetails { Title = "A problem occured with your request." });
            }
            User? user = await _userManager.FindByNameAsync(loginUserDto.UserName);
            if (user == null) return StatusCode(401, new ProblemDetails { Title = "Please create a valid account to login." });

            var passwordOk = await _userManager.CheckPasswordAsync(user, loginUserDto.Password);

            if (!passwordOk) return Unauthorized(new ProblemDetails { Title = "Incorrect password, try again." });

            user.LastLogin = DateTime.Now;
            var saveChangesResult = await _bgtContext.SaveChangesAsync();
            if (saveChangesResult <= 0)
            {
                return BadRequest(new ProblemDetails { Title = "A problem occured with your request" });
            }

            LoggedInUserDto result = new(user.Id.ToString(), user.UserName!, user.Email!, await _tokenService.GenerateToken(user));
            return Ok(result);
        }
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<LoggedInUserDto>> GetCurrentUser()
        {
            if (User == null || User.Identity == null || User.Identity.Name == null)
            {
                return NotFound();
            }
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            if (user == null)
            {
                return BadRequest();
            }
            LoggedInUserDto loggedInUserDto = new(user.Id.ToString(), user.UserName!, user.Email!, await _tokenService.GenerateToken(user));
            return Ok(loggedInUserDto);
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterUserDto registerUserDto)
        {
            if (!ModelState.IsValid)
            {
                var modelErrors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToArray();

                return BadRequest(modelErrors);
            }

            var userAlreadyExists = await _userManager.FindByNameAsync(registerUserDto.UserName);
            if (userAlreadyExists != null)
            {
                return BadRequest(new[] { $"User with username {registerUserDto.UserName} already exists. Please log in." });
            }

            var user = new User
            {
                UserName = registerUserDto.UserName,
                Email = registerUserDto.Email,
                RegisteredDate = DateTime.Now,
                SecurityStamp = Guid.NewGuid().ToString(),
            };

            var createdNewUserResult = await _userManager.CreateAsync(user, registerUserDto.PassWord);
            var roleResult = await _userManager.AddToRoleAsync(user, "Guest");

            if (!createdNewUserResult.Succeeded || !roleResult.Succeeded)
            {
                var identityErrors = createdNewUserResult.Errors.Select(e => e.Description);
                var roleErrors = roleResult.Errors.Select(e => e.Description);

                var allErrors = identityErrors.Concat(roleErrors).ToArray();
                return BadRequest(allErrors);
            }

            return Ok();
        }


        [HttpPost("create")]
        public async Task<ActionResult<UserDto>> Create(RegisterUserDto registerUserDto)
        {
            string userLastLoggedInDate = "TBD";
            if (!ModelState.IsValid)
            {
                return BadRequest(new ProblemDetails { Title = "Model State is not valid." });
            }
            User? userAlreadyExists = await _userManager.FindByNameAsync(registerUserDto.UserName);
            if (userAlreadyExists != null)
            {

                return BadRequest(new ProblemDetails { Title = $"User with username {registerUserDto.UserName} already exists." });
            }
            User user = new()
            {
                UserName = registerUserDto.UserName,
                Email = registerUserDto.Email,
                RegisteredDate = DateTime.Now,
            };
            var createdNewUserResult = await _userManager.CreateAsync(user, registerUserDto.PassWord);
            if (!createdNewUserResult.Succeeded)
            {

                foreach (var error in createdNewUserResult.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }


            var lastLoggedInDateHasValue = user.LastLogin.HasValue;
            if (lastLoggedInDateHasValue && user.LastLogin is not null)
            {
                userLastLoggedInDate = user.LastLogin.Value.ToString("yyyy-MM-dd");
            }

            UserDto createdUser = new(user.Id, user.UserName, user.Email, user.RegisteredDate.ToString("yyyy-MM-dd"), userLastLoggedInDate);
            return Ok(createdUser);
        }




    }
}