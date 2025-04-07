using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
namespace HMS.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendNotificationAsync(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }

}