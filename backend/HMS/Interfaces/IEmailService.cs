namespace HMS.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string nom);
        Task SendEmailAsync_crenaux(string to, string subject, string body);
    }
}