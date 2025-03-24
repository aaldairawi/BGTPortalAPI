using System.ComponentModel.DataAnnotations;

namespace API.Dtos.Role
{
    public record CreateRoleDto([Required] string Name, [Required] string NormalizedName);
}