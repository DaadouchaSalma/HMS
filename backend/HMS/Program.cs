using HMS.Interfaces;
using HMS.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using HMS.Models;
using HMS.Services;
using System.Net.Mail;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();

// Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
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
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHostedService<RdvBackgroundService>();
builder.Services.AddScoped<IMedecinRepository, MedecinRepository>();
builder.Services.AddScoped<IPharmacieRepository, PharmacieRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();
builder.Services.AddScoped<IRdvRepository, RdvRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IFournisseur, FournisseurRepository>();
builder.Services.AddScoped<ListeAttenteRepository>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {


            policy.WithOrigins("http://localhost:4200") 

                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});



// Add services to the container.

builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllersWithViews();
// Register the DbContext with dependency injection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")),
    ServiceLifetime.Scoped);
// Configuration d'Identity avec gestion des rôles
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var app = builder.Build();
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


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseCors("AllowAngularApp");

//app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();