using System;
using HMS.Hubs;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize(Roles = "PersonnelAdministratif, Medecin, Pharmacien")]
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<MessageHub> _hub;

        public MessageController(ApplicationDbContext context, IHubContext<MessageHub> hub, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _hub = hub;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            if (!User.Identity.IsAuthenticated)
                return Unauthorized(new { message = "Utilisateur non authentifié" });

            var identityUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(identityUserId))
                return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });

            var expediteur = await _context.Personnels
                .FirstOrDefaultAsync(p => p.IdentityUserId == identityUserId);

            if (expediteur == null)
                return NotFound(new { message = "Personnel introuvable." });

            var destinataire = await _context.Personnels
                .FirstOrDefaultAsync(p => p.Id == message.DestinataireId);

            if (destinataire == null)
                return NotFound(new { message = "Destinataire introuvable." });

            //message.Id = Guid.NewGuid();
            message.ExpediteurId = expediteur.Id;
            message.SentAt = DateTime.Now;

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            await _hub.Clients.User(destinataire.IdentityUserId)
                .SendAsync("ReceiveMessage", expediteur.Id.ToString(), message.Content, message.SentAt);

            return Ok(message);
        }


        [HttpGet("between/{otherUserId}")]
        public async Task<IActionResult> GetMessages(Guid otherUserId)
        {
            if (!User.Identity.IsAuthenticated)
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var identityUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(identityUserId))
                return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });

            var currentUser = await _context.Personnels
                .FirstOrDefaultAsync(p => p.IdentityUserId == identityUserId);

            if (currentUser == null)
                return NotFound(new { message = "Utilisateur actuel introuvable." });

            var messages = await _context.Messages
                .Where(m =>
                    (m.ExpediteurId == currentUser.Id && m.DestinataireId == otherUserId) ||
                    (m.ExpediteurId == otherUserId && m.DestinataireId == currentUser.Id))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpGet("listePerso")]
        [Authorize(Roles = "PersonnelAdministratif, Medecin, Pharmacien, Admin")]
        public async Task<ActionResult<IEnumerable<Personnel>>> GetPersonnels()
        {
            var identityUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(identityUserId))
                return BadRequest(new { message = "Impossible de récupérer l'utilisateur actuel." });

            var currentPersonnel = await _context.Personnels
                .FirstOrDefaultAsync(p => p.IdentityUserId == identityUserId);

            if (currentPersonnel == null)
                return NotFound(new { message = "Personnel non trouvé." });

            var personnels = await _context.Personnels
                .Where(p => p.Id != currentPersonnel.Id)
                .ToListAsync();

            return personnels;
        }

        [HttpGet("me")]
        [Authorize(Roles = "PersonnelAdministratif, Medecin, Pharmacien")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var identityUserId = _userManager.GetUserId(User);

            if (string.IsNullOrEmpty(identityUserId))
                return Unauthorized(new { message = "Utilisateur non authentifié." });

            var currentPersonnel = await _context.Personnels
                .FirstOrDefaultAsync(p => p.IdentityUserId == identityUserId);

            if (currentPersonnel == null)
                return NotFound(new { message = "Utilisateur introuvable." });

            return Ok(currentPersonnel);
        }


        [HttpGet("last/{contactId}")]
        [Authorize(Roles = "PersonnelAdministratif, Medecin, Pharmacien")]
        public async Task<IActionResult> GetLastMessageWithContact(Guid contactId)
        {
            if (!User.Identity.IsAuthenticated)
                return Unauthorized(new { message = "Utilisateur non authentifié" });

            var identityUserId = _userManager.GetUserId(User);
            if (string.IsNullOrEmpty(identityUserId))
                return BadRequest(new { message = "Impossible de récupérer l'ID de l'utilisateur connecté." });

            var currentUser = await _context.Personnels
                .FirstOrDefaultAsync(p => p.IdentityUserId == identityUserId);

            if (currentUser == null)
                return NotFound(new { message = "Utilisateur introuvable." });

            var contact = await _context.Personnels
                .FirstOrDefaultAsync(p => p.Id == contactId);

            if (contact == null)
                return NotFound(new { message = "Contact introuvable." });

            var lastMessage = await _context.Messages
                .Where(m =>
                    (m.ExpediteurId == currentUser.Id && m.DestinataireId == contactId) ||
                    (m.ExpediteurId == contactId && m.DestinataireId == currentUser.Id))
                .OrderByDescending(m => m.SentAt)
                .FirstOrDefaultAsync();

            if (lastMessage == null)
                return NoContent();

            var result = new
            {
                Id = lastMessage.Id,
                Content = lastMessage.Content,
                SentAt = lastMessage.SentAt,
                ExpediteurId = lastMessage.ExpediteurId,
                DestinataireId=lastMessage.DestinataireId,
                read=lastMessage.Read
            };

            return Ok(result);
        }

        [HttpPost("markasread/{messageId}")]
        [Authorize(Roles = "PersonnelAdministratif, Medecin, Pharmacien")]
        public async Task<IActionResult> MarkAsRead(Guid messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message == null) return NotFound();

            message.Read = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
