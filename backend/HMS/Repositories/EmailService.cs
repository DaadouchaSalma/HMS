using HMS.Interfaces;
using NuGet.Protocol.Plugins;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace HMS.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpClient _smtpClient; // Configurez votre client SMTP ici
        
        public EmailService(SmtpClient smtpClient)
        {
            _smtpClient = smtpClient;
        }
        public async Task SendEmailAsync(string to, string nom)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("smartcare314@gmail.com", "fjni rtid zvgp gdta"),
                EnableSsl = true,
            };

            var feedbackFormUrl = $"https://forms.gle/cFnHqxu1nKLbszWr6";

            var emailBody = $@"
            <html>
            <body>
                <h2>Bonjour {nom},</h2>
                <p>Merci d'avoir pris un rendez-vous avec nous. Nous aimerions connaître votre avis.</p>
                <p>Veuillez remplir ce court formulaire :</p>
                <p>
                    <a href='{feedbackFormUrl}' style='display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;'>Donner votre avis</a>
                </p>
                <p>Merci pour votre retour !</p>
                <p>Cordialement,<br>Votre Équipe Médicale</p>
            </body>
            </html>";

            var mailMessage = new MailMessage
            {
                From = new MailAddress("smartcare314@gmail.com"),
                Subject = "Votre avis sur votre rendez-vous",
                Body = emailBody,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }

        public async Task SendEmailAsync_crenaux(string to, string subject, string body)
        {
            var mailMessage = new MailMessage {
                From= new MailAddress("smartcare314@gmail.com"),
                Subject= subject,
                Body=body,
                IsBodyHtml = true };
            mailMessage.To.Add(to);
            
            await _smtpClient.SendMailAsync(mailMessage);
        }

    }
}