
namespace API.Services.HTTPHelper;

public class HttpHelperRepository(IHttpContextAccessor httpContextAccessor) : IHttpHelper
{
    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor ??
        throw new ArgumentNullException(nameof(httpContextAccessor));



    public int GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var currentUserId))
            throw new UnauthorizedAccessException("User ID not found or invalid.");
        return currentUserId;

    }

}