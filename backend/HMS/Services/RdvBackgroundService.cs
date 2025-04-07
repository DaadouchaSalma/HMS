using HMS.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;

public class RdvBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public RdvBackgroundService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var rdvRepo = scope.ServiceProvider.GetRequiredService<IRdvRepository>();
                await rdvRepo.CheckAndSendFeedbackEmailsAsync();
            }
            await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken); 
        }
    }
}

