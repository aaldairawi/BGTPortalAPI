global using static System.Console;
using System.Text;
using API.Data;
using API.Entities;
using API.Helper;
using API.Middleware;
using API.Services.AppUser;
using API.Services.CSVBuilder;
using API.Services.Database;
using API.Services.HTTPHelper;
using API.Services.InvoiceDashboard;
using API.Services.Invoices;
using API.Services.Invoices.ConsigneeInvoices;
using API.Services.Invoices.InvoiceHelper;
using API.Services.Invoices.SearchInvoices;
using API.Services.Invoices.ShippingLineInvoices;
using API.Services.InvoiceUploadGuard;
using API.Services.N4ContainerHistory;
using API.Services.Stripping;
using API.Services.Token;
using API.Services.UploadInvoices;
using API.Services.VesselSchedule;
using Microsoft.AspNetCore.Authentication.JwtBearer;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;


using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);
WriteLine("Start of the app right here");

builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);



builder.Services.AddDbContext<BGTContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});


const string FrontendCors = "Frontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCors, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Content-Disposition");
    });
});



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


builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>();

builder.Services.AddScoped<IContainerCurrentStatus, ContainerCurrentStatusRepository>();
builder.Services.AddScoped<IContainerImportLifeTime, ContainerImportLifeTimeRepository>();
builder.Services.AddScoped<IContainerExportLifeTime, ContainerExportLifeTimeRepository>();

builder.Services.AddScoped<IContainerGeneralRequests, ContainerGeneralRequestsRepository>();
builder.Services.AddScoped<IContainerLifeTimeMasterData, ContainerLifeTimeMasterDataRepository>();
builder.Services.AddScoped<IVesselInformation, VesselInformationRepository>();

builder.Services.AddScoped<IConsigneeFinalInvoices, ConsigneeFinalInvoicesRepository>();
builder.Services.AddScoped<IUserRoleHelper, UserRoleHelperRepository>();
builder.Services.AddScoped<IInvoiceHelper, InvoiceHelperRepository>();
builder.Services.AddScoped<ISearchInvoices, SearchInvoicesRepository>();
builder.Services.AddScoped<IShippingLineFinalInvoices, ShippingLineFinalInvoicesRepository>();


builder.Services.AddScoped<IStripping, StrippingRepository>();

builder.Services.AddScoped<IStrippingHelper, StrippingHelperRepository>();
builder.Services.AddScoped<IDatabase, DataBaseRepository>();

builder.Services.AddScoped<IUploadConsigneeInvoices, UploadConsigneeInvoicesRepository>();
builder.Services.AddScoped<IUploadInvoicesHelper, UploadInvoicesHelperRepository>();
builder.Services.AddScoped<IInvoiceGeneralInfo, InvoiceGeneralInfoRepository>();

builder.Services.AddScoped<ICsvBuilderService, CsvBuilderServiceRepository>();
builder.Services.AddScoped<IUploadSL2Invoices, UploadSL2InvoicesRepository>();
builder.Services.AddScoped<IUploadSL4Invoices, UploadSL4InvoicesRepository>();
builder.Services.AddScoped<IInvoiceDashboard, InvoiceDashboardRepository>();
// Http Helpers 
builder.Services.AddScoped<IHttpHelper, HttpHelperRepository>();
builder.Services.AddScoped<IInvoiceUploadGuard, InvoiceUploadGuardRepository>();

// Vessel Schedule
builder.Services.AddScoped<IVesselSchedule, VesselScheduleRepository>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");

// Configure the HTTP request pipeline.



app.UseCors(FrontendCors);


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