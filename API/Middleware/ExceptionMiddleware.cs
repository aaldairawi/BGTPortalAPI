namespace API.Middleware;


public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger _logger = logger;
    private readonly IHostEnvironment _env = env;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "An error occurred");

            context.Response.ContentType = "application/json";

            var response = new
            {
                message = exception.Message
            };

            context.Response.StatusCode = exception switch
            {
                InvalidOperationException => 400, 
                UnauthorizedAccessException => 401,
                KeyNotFoundException => 404,
                _ => 500 
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
