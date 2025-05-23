global using static System.Console;
using System.Text;
using API.Data;
using API.Entities;
using API.Helper;
using API.Middleware;
using API.Services;
using API.Services.AppUser;
using API.Services.Invoices;
using API.Services.N4ContainerHistory;
using API.Services.Token;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Place your bearer token here buddy: Bearer + token",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme,
        }
    };
    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            jwtSecurityScheme,Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<BGTContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();

builder.Services.AddIdentityCore<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
    opt.Password.RequiredLength = 8;
    opt.Password.RequireDigit = true;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<BGTContext>();
builder.Services.AddApiVersioning(options =>
{

    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
    options.ReportApiVersions = true;
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]!)),
    };
});


builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<IContainerImportLifeTime, ContainerImportLifeTimeRepository>();
builder.Services.AddScoped<IContainerExportLifeTime, ContainerExportLifeTimeRepository>();
builder.Services.AddScoped<IContainerGeneralRequests, ContainerGeneralRequestsRepository>();
builder.Services.AddScoped<IContainerCurrentStatus, ContainerCurrentStatusRepository>();
builder.Services.AddScoped<IFinalInvoice, FinalInvoiceRepository>();
builder.Services.AddScoped<IUserRoleHelper, UserRoleHelperRepository>();
builder.Services.AddScoped<IInvoiceHelper, InvoiceHelperRepository>();


builder.Services.AddScoped<IDatabase, DataBaseRepository>();
builder.Services.AddScoped<IUploadInvoices, UploadInvoicesRepository>();



var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

app.UseCors(opt => { opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000", "http://localhost:3001"); });

// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<BGTContext>();

var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(userManager);

}
catch (Exception exception)
{
    logger.LogError(exception, "An error occured with the database migration.");

}
app.Run();