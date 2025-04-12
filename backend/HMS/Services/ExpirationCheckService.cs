using HMS.Hubs;
using HMS.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public class ExpirationCheckService : BackgroundService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<ExpirationCheckService> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public ExpirationCheckService(IServiceScopeFactory serviceScopeFactory, ILogger<ExpirationCheckService> logger, IHubContext<NotificationHub> hubContext)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await CheckExpiringMedications();

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            await CheckExpiringMedications();
        }
    }

    private async Task CheckExpiringMedications()
    {
        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var targetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7));

            // Clear the medNotifs table before adding new notifications
            dbContext.medNotifs.RemoveRange(dbContext.medNotifs);
            await dbContext.SaveChangesAsync(); // Ensure deletion is committed

            var soonExpiringMedications = await dbContext.Medicaments
                .Where(m => m.Date_Exp <= targetDate)
                .ToListAsync();
            var soonRunOutMedications = await dbContext.Medicaments
                .Where(m => m.Nbr_stock <= 10)
                .ToListAsync();

            foreach (var med in soonExpiringMedications)
            {
                string message = $"Le produit '{med.Nom}' va expirer en {med.Date_Exp:yyyy-MM-dd}!";

                await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
                _logger.LogInformation($"Notification sent: {message}");

                var notif = new MedNotifs
                {
                    Id = Guid.NewGuid(),
                    Message = message
                };

                dbContext.medNotifs.Add(notif);
                await dbContext.SaveChangesAsync();
            }
            foreach (var med in soonRunOutMedications)
            {
                string message = $"Il reste {med.Nbr_stock} unités de '{med.Nom}' seulement!";

                await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
                _logger.LogInformation($"Notification sent: {message}");

                var notif = new MedNotifs
                {
                    Id = Guid.NewGuid(),
                    Message = message
                };

                dbContext.medNotifs.Add(notif);
                await dbContext.SaveChangesAsync();
            }
        }

        _logger.LogInformation("Checked for soon-to-expire medications.");
    }
}
