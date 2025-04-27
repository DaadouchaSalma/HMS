using HMS.Interfaces;
using HMS.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using HMS.Models;
using HMS.Hubs;
using HMS.Services;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Net.Http.Headers;
using Stripe;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();

// Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowCredentials()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddScoped<SmtpClient>(sp =>
{
    var smtpClient = new SmtpClient("smtp.gmail.com")
    {
        Port = 587, // ou 465, selon votre serveur SMTP
        Credentials = new System.Net.NetworkCredential("smartcare314@gmail.com", "fjni rtid zvgp gdta"),
        EnableSsl = true,
    };
    return smtpClient;
});
builder.Services.AddHttpClient<IChatBotMedRepository, ChatBotMedRepository>();
//builder.Services.AddHttpClient();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHostedService<RdvBackgroundService>();
builder.Services.AddScoped<IMedecinRepository, MedecinRepository>();
builder.Services.AddScoped<IPharmacieRepository, PharmacieRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IRdvRepository, RdvRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IFournisseur, FournisseurRepository>();
builder.Services.AddHostedService<ExpirationCheckService>();
builder.Services.AddScoped<IPanierRepository, PanierRepository>();
builder.Services.AddScoped<IChatBotMedRepository, ChatBotMedRepository>();
builder.Services.AddSignalR();





builder.Services.AddScoped<IReclamationRepository, ReclamationRepository>();
builder.Services.AddScoped<ListeAttenteRepository>();
builder.Services.AddScoped<IDossierMRepository, DossierMRepository>();


// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

builder.Services.AddSingleton(new StripeClient(builder.Configuration["Stripe:SecretKey"]));

builder.Services.AddOpenApi();
builder.Services.AddControllersWithViews();
/*builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.None; // Set to Always in production (change to None for local dev)
        options.Cookie.SameSite = SameSiteMode.None; // Required for frontend-backend communication
        options.Cookie.Name = "AuthCookie";
        options.LoginPath = "/api/auth/login";
        // Define login path for redirection when authentication is required
        //options.LoginPath = "/api/auth/login";
        //options.AccessDeniedPath = "/api/auth/access-denied"; // Customize the path for access denied
    });*/

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "AuthCookie";
    //options.Cookie.HttpOnly = true;
    //options.Cookie.SecurePolicy = CookieSecurePolicy.None; // Use CookieSecurePolicy.Always in production
    //options.Cookie.SameSite = SameSiteMode.None;
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
});

// Add Authorization (to protect routes)
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Authenticated", policy => policy.RequireAuthenticatedUser());
});
// Register the DbContext with dependency injection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")),
    ServiceLifetime.Scoped);
// Configuration d'Identity avec gestion des rôles
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseStaticFiles();

// Création des rôles au démarrage

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    string[] roles = { "PersonnelAdministratif", "Medecin", "Pharmacien", "Patient", "Admin" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}
app.MapHub<NotificationHub>("/notificationHub");
app.MapHub<MessageHub>("/message");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseCors("AllowAngularApp");

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always,
    //Secure = CookieSecurePolicy.Always
    Secure = CookieSecurePolicy.None
});


app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();