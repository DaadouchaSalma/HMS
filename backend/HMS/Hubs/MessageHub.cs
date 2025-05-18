using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using HMS.Models;

namespace HMS.Hubs
{
    [Authorize(Roles = "PersonnelAdministrative, Medecin, Pharmacien")]
    public class MessageHub : Hub
    {
        public async Task SendMessage(string senderId, string receiverId, string message)
        {
            await Clients.User(receiverId).SendAsync("ReceiveMessage", senderId, message, DateTime.Now);
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }
    }
}
