using Microsoft.AspNetCore.Mvc;
using HMS.Models;
using System;
using Microsoft.EntityFrameworkCore;
using NewtonsoftJson = Newtonsoft.Json;
using SystemTextJson = System.Text.Json;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.StaticFiles;
using System.Net;




namespace HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class DossierMController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;
        private static List<DossierM> dossiers = new List<DossierM>();

        public DossierMController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDossier(Guid id)
        {
            var dossier = await _context.Dossiers
                .FirstOrDefaultAsync(d => d.Id == id);

            if (dossier == null)
            {
                return NotFound();
            }
            return Ok(dossier);
            
        }
        [HttpPost("ajouteranalyse")]
        public IActionResult AjouterAnalyse([FromForm] Guid dossierId, [FromForm] IFormFile fichier, [FromForm] string nom)
        {
          
            var dossier = _context.Dossiers.FirstOrDefault(d => d.Id == dossierId);
            if (dossier == null)
            {
                return NotFound("Dossier non trouvé.");
            }

            // Vérifier fichier
            if (fichier == null || fichier.Length == 0)
            {
                return BadRequest("Fichier non valide.");
            }

            // Créer le dossier où les fichiers seront stockés
            string uploadsFolder = Path.Combine(_env.WebRootPath, "analyse");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Générer un nom de fichier unique
            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(fichier.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Sauvegarder le fichier sur le serveur
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                fichier.CopyTo(fileStream);
            }

            // Générer l'URL du fichier
            string fichierUrl = $"/analyse/{fileName}";
            Console.WriteLine($"voici : {fichierUrl}{nom}");
            List<Dictionary<string, string>> analyses;
            if (!string.IsNullOrEmpty(dossier.liste_analyse))
            {
                // Désérialiser la chaîne JSON existante
                var jsonString = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(dossier.liste_analyse);
                analyses = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(jsonString);
            }
            else
            {
                // Créer une nouvelle liste vide
                analyses = new List<Dictionary<string, string>>();
            }

            // Ajouter une nouvelle analyse
            analyses.Add(new Dictionary<string, string>
                   {
                        { "nom", nom },
                        { "fichierUrl", fichierUrl }
                    });
            Console.WriteLine("Liste des analyses :");
            foreach (var analyse in analyses)
            {
                Console.WriteLine($"- Nom: {analyse["nom"]}, Fichier: {analyse["fichierUrl"]}");
            }

            // Sérialiser 
            string jsonAnalyses = Newtonsoft.Json.JsonConvert.SerializeObject(analyses);

            //  sérialisez à nouveau
            dossier.liste_analyse = Newtonsoft.Json.JsonConvert.SerializeObject(jsonAnalyses);
            _context.SaveChanges();
            return Ok(new { message = "Analyse ajoutée avec succès", fichierUrl });

        }

        [HttpGet("telecharger-analyse")]
        public IActionResult TelechargerAnalyse(Guid dossierId, string fichierUrl)
        {
            var dossier = _context.Dossiers.FirstOrDefault(d => d.Id == dossierId);
            if (dossier == null)
            {
                return NotFound("Dossier non trouvé.");
            }

            // Vérifier que `liste_analyse` n'est pas vide
            if (string.IsNullOrEmpty(dossier.liste_analyse))
            {
                return NotFound("Aucune analyse trouvée.");
            }

            // Désérialiser correctement la liste d'analyses
            var jsonString = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(dossier.liste_analyse);
            var analyses = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(jsonString);

            // Vérifier si le fichier existe dans la liste
            // var analyse = analyses.FirstOrDefault(a => a["fichierUrl"] == fichierUrl);
            var decodedFichierUrl = WebUtility.UrlDecode(fichierUrl);
            var analyse = analyses.FirstOrDefault(a =>
                a.ContainsKey("fichierUrl") &&
                a["fichierUrl"].Equals(decodedFichierUrl, StringComparison.OrdinalIgnoreCase));
            Console.WriteLine($" voicii {analyse}");
            if (analyse == null)
            {
                return NotFound("Fichier introuvable dans la liste des analyses.");
            }

            // Construire le chemin absolu du fichier
            string filePath = Path.Combine(_env.WebRootPath, fichierUrl.TrimStart('/'));
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Fichier non trouvé sur le serveur.");
            }

            // Détecter le type MIME du fichier
            //string contentType = "application/octet-stream";
            /*var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (provider.TryGetContentType(filePath, out var mimeType))
            {
                contentType = mimeType;
            }*/
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".pdf"] = "application/pdf"; // Assure le type MIME pour PDF

            if (!provider.TryGetContentType(filePath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            // Retourner le fichier pour téléchargement
            /*byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            string fileName = Path.GetFileName(filePath);
            return File(fileBytes, contentType, fileName);*/
            return PhysicalFile(filePath, contentType, Path.GetFileName(filePath));

        }


    }
}
