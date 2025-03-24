using API.Data;
using API.Dtos.Role;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class RolesController : BaseApiController
    {
        private readonly RoleManager<Role> _roleManager;
        private readonly IMapper _mapper;
        private readonly BGTContext _context;

        public RolesController(RoleManager<Role> roleManager, IMapper mapper,
        BGTContext context)
        {
            _roleManager = roleManager;
            _mapper = mapper;
            _context = context;

        }

        [HttpGet("getall")]
        public async Task<ActionResult<List<GetRoleDto>>> GetAll()
        {
            WriteLine("Get all roles method hit");
            List<Role> roles = await _roleManager.Roles.ToListAsync();

            List<GetRoleDto> result = roles.Select(role => new GetRoleDto
            (
                role.Id,
                 role.Name ?? "",
                 role.NormalizedName ?? ""
            )).ToList();
            return Ok(result);
        }
        [HttpGet("{roleName}", Name = "GetOneRole")]
        public async Task<ActionResult<GetRoleDto>> GetOneRole(string roleName)
        {
            Role? identityRole = await _roleManager.FindByNameAsync(roleName);

            GetRoleDto result = _mapper.Map<GetRoleDto>(identityRole);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<GetRoleDto>> CreateRole(CreateRoleDto createRoleDto)
        {
            WriteLine(createRoleDto);
            if (!ModelState.IsValid)
            {
                return BadRequest(new ProblemDetails { Title = "Please check your Model State." });
            }
            WriteLine("Create role method hit now!");

            List<Role> currentRoles = [.. _roleManager.Roles];


            bool roleAlreadyExists = _roleManager.Roles.Select(u => u.Name).ToList().Contains(createRoleDto.Name);
            if (roleAlreadyExists)
            {
                return BadRequest(new ProblemDetails { Title = $"{createRoleDto.Name} already exists in the app." });
            }
            var identityResult = await _roleManager.CreateAsync(new Role { Name = createRoleDto.Name, NormalizedName = createRoleDto.NormalizedName });
            if (identityResult.Succeeded)
            {
                await _context.SaveChangesAsync();
                var createdRole = await _roleManager.Roles.FirstOrDefaultAsync((role) => role.Name == createRoleDto.Name);
                if (createdRole == null) return BadRequest(new ProblemDetails { Title = "Problem retrieving the saved role" });

                var result = new GetRoleDto(createdRole.Id, createdRole.Name!, createdRole.NormalizedName!);

                return CreatedAtRoute("GetOneRole", new { roleName = createRoleDto.Name }, result);
            }
            return BadRequest(new ProblemDetails { Title = " Error occured creating a new role" });
        }
        public record DeleteRoleDto(string RoleName);
        [HttpDelete]
        public async Task<ActionResult> Delete(DeleteRoleDto roleName)
        {
            Role? roleToDelete = await _roleManager.FindByNameAsync(roleName.RoleName);
            if (roleToDelete == null)
            {
                return NotFound($"The passed role {roleName} does not exist");
            }
            IdentityResult result = await _roleManager.DeleteAsync(roleToDelete);
            return NoContent();
        }



    }
}