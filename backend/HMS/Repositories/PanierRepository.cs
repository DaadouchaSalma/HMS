using HMS.Interfaces;
using HMS.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace HMS.Repositories
{
    public class PanierRepository : IPanierRepository
    {
        private readonly ApplicationDbContext _context;

        public PanierRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Panier> AddToPanierAsync(Prescription prescription)
        {
            var medsList = JsonSerializer.Deserialize<List<MedicamentDTO>>(prescription.ListeMed);
            var panier = new Panier
            {
                Id = Guid.NewGuid(),
                PatientId = prescription.PatientId,
                Patient = prescription.Patient,
                MissingMeds = CheckMissingMeds(medsList)
            };

            foreach (var med in medsList)
            {
                var existingMed = _context.Medicaments.FirstOrDefault(m => m.Nom == med.Nom);
                if (existingMed != null)
                {
                    var quantityToAdd = Math.Min(med.Quantite, existingMed.Nbr_stock); 

                    var panierItem = new MedPanier
                    {
                        Id = Guid.NewGuid(),
                        quantity = quantityToAdd,
                        medicamentID = existingMed.Id,
                        Medicament = existingMed,
                        PanierId = panier.Id,
                        panier = panier
                    };

                    _context.MedPaniers.Add(panierItem);
                }
            }

            _context.Paniers.Add(panier);
            await _context.SaveChangesAsync();
            return panier;
        }


        public async Task<List<object>> GetAllPaniersAsync()
        {
            var paniers = await _context.Paniers
                .Where( p => p.state == "courant" || p.state == "incomplet")
                .Include(p => p.Patient)
                .Include(p => p.medPaniers).ThenInclude(mp => mp.Medicament)
                .ToListAsync();

            return paniers.Select(p => new
            {
                PanierId = p.Id,
                PatientName = $"{p.Patient.Nom} {p.Patient.Prenom}",
                PatientEmail = p.Patient.Email,
                Medications = p.medPaniers.Select(mp => new
                {
                    MedName = mp.Medicament.Nom,
                    Quantity = mp.quantity
                }),
                MissingMedications = p.MissingMeds?.Select(m => new
                {
                    medID = m.ID,
                    MedName = m.Nom,
                    quantity = m.Quantite,
                })
            }).Cast<object>().ToList();
        }

        public async Task<List<Panier>> GetPaniersByPatientAsync(Guid patientId)
        {
            return await _context.Paniers
                .Where(p => p.PatientId == patientId)
                .Include(p => p.medPaniers).ThenInclude(mp => mp.Medicament)
                .ToListAsync();
        }
        public async Task<Panier> GetPanierByIdAsync(Guid panierId)
        {
            return await _context.Paniers
                .Include(p => p.medPaniers)
                    .ThenInclude(mp => mp.Medicament)
                .Include(p => p.Patient)
                .FirstOrDefaultAsync(p => p.Id == panierId);
        }

        public async Task<object> ValidatePanierAsync(Guid panierId)
        {
            var panier = await _context.Paniers
                .Include(p => p.medPaniers)
                .ThenInclude(mp => mp.Medicament)
                .FirstOrDefaultAsync(p => p.Id == panierId);

            if (panier == null) return null;

            var allMedsStillAvailable = true;
            var updatedMissingMeds = new List<MedicamentDTO>();

            // Re-check availability for existing medPaniers
            foreach (var item in panier.medPaniers)
            {
                if (item.Medicament.Nbr_stock < item.quantity)
                {
                    allMedsStillAvailable = false;

                    updatedMissingMeds.Add(new MedicamentDTO
                    {
                        ID = item.Medicament.Id.ToString(),
                        Nom = item.Medicament.Nom,
                        Quantite = item.quantity - item.Medicament.Nbr_stock, 
                        Categorie = item.Medicament.categorie?.Name 
                    });
                }
            }

            // Check if missing meds are now satisfiable
            foreach (var missing in panier.MissingMeds)
            {
                var med = await _context.Medicaments.FirstOrDefaultAsync(m => m.Nom == missing.Nom);
                if (med == null || med.Nbr_stock < missing.Quantite)
                {
                    allMedsStillAvailable = false;
                    updatedMissingMeds.Add(new MedicamentDTO
                    {
                        Nom = missing.Nom,
                        Quantite = med == null ? missing.Quantite : missing.Quantite - med.Nbr_stock,
                        Categorie = missing.Categorie ?? "autre"
                    });
                }
            }

            if (allMedsStillAvailable)
            {
                // Deduct stock for both medPaniers and missingMeds that were just added
                foreach (var item in panier.medPaniers)
                {
                    var med = item.Medicament;
                    med.Nbr_stock -= item.quantity;
                }

                panier.MissingMeds = new List<MedicamentDTO>();
                panier.state = "valide";
                panier.DateValidation = DateTime.Now;

                await _context.SaveChangesAsync();
                return new { message = "Panier validated and deleted as no missing meds." };
            }
            else
            {
                panier.MissingMeds = updatedMissingMeds;
                panier.state = "incomplet";
                panier.DateValidation = DateTime.Now;
                await _context.SaveChangesAsync();
                return new
                {
                    message = "Panier incomplet. Some medications are still missing.",
                    missingMeds = updatedMissingMeds
                };
            }
        }



        public async Task RefreshAllPaniersMissingMedsAsync()
        {
            var paniers = await _context.Paniers
                .Include(p => p.medPaniers)
                    .ThenInclude(mp => mp.Medicament)
                .Include(p => p.Patient)
                .ToListAsync();

            if (paniers == null) return;

            foreach (var panier in paniers)
            {
                var updatedMissingMeds = new List<MedicamentDTO>();

                // Step 1: Update existing medPaniers based on current stock
                foreach (var item in panier.medPaniers)
                {
                    var med = await _context.Medicaments.FirstOrDefaultAsync(m => m.Id == item.medicamentID);
                    if (med == null)
                    {
                        updatedMissingMeds.Add(new MedicamentDTO
                        {
                            Nom = item.Medicament?.Nom ?? "Unknown",
                            Quantite = item.quantity,
                            Categorie = item.Medicament.categorie.Name ?? "autre" // include category name
                        });
                        item.quantity = 0;
                    }
                    else if (med.Nbr_stock < item.quantity)
                    {
                        updatedMissingMeds.Add(new MedicamentDTO
                        {
                            Nom = med.Nom,
                            Quantite = item.quantity - med.Nbr_stock,
                            Categorie = med.categorie?.Name ?? "autre"
                        });
                        item.quantity = med.Nbr_stock;
                    }
                }

                // Step 2: Try fulfilling missing meds with updated stock
                foreach (var missingItem in panier.MissingMeds.ToList())
                {
                    var med = await _context.Medicaments.FirstOrDefaultAsync(m => m.Nom == missingItem.Nom);
                    if (med == null || med.Nbr_stock == 0)
                    {
                        // Still fully missing
                        updatedMissingMeds.Add(missingItem);
                        continue;
                    }

                    var quantityToAdd = Math.Min(missingItem.Quantite, med.Nbr_stock);
                    var remainingMissing = missingItem.Quantite - quantityToAdd;

                    // Check if it already exists in medPaniers
                    var existingMedPanier = panier.medPaniers
                        .FirstOrDefault(mp => mp.Medicament.Nom.Equals(med.Nom, StringComparison.OrdinalIgnoreCase));

                    if (existingMedPanier != null)
                    {
                        existingMedPanier.quantity += quantityToAdd;
                    }
                    else
                    {
                        panier.medPaniers.Add(new MedPanier
                        {
                            PanierId = panier.Id,
                            medicamentID = med.Id,
                            quantity = quantityToAdd,
                            Medicament = med
                        });
                    }

                    // Add to missing if not fully satisfied
                    if (remainingMissing > 0)
                    {
                        updatedMissingMeds.Add(new MedicamentDTO
                        {
                            Nom = med.Nom,
                            Quantite = remainingMissing,
                            Categorie = med.categorie?.Name ?? "autre"
                        });
                    }
                }

                panier.MissingMeds = updatedMissingMeds;
            }

            await _context.SaveChangesAsync();
        }








        public async Task MarkMedicamentAsMissingInPaniersAsync(Guid medicamentId)
        {
            Console.WriteLine($"MarkMedicamentAsMissingInPaniersAsync workingggggggggggg");

            var med = await _context.Medicaments.FindAsync(medicamentId);
            if (med != null)  // Proceed if the medicament exists
            {
                Console.WriteLine($"MarkMedicamentAsMissingInPaniersAsync found medicament: {med.Nom}, proceeding...");

                var paniers = await _context.Paniers
                    .Include(p => p.medPaniers)
                    .ThenInclude(mp => mp.Medicament)
                    .ToListAsync();

                foreach (var panier in paniers)
                {
                    var medToRemove = panier.medPaniers.FirstOrDefault(mp => mp.medicamentID == medicamentId);
                    var mmpu = panier.MissingMeds;

                    if (medToRemove != null)
                    {
                        Console.WriteLine($"MarkMedicamentAsMissingInPaniersAsync found medToRemove: {medToRemove.Medicament.Nom}");

                        if (mmpu.IsNullOrEmpty())
                        {
                            mmpu = new List<MedicamentDTO>();  // Initialize if null
                        }

                        // Ensure the missing medicament list is updated with the correct quantity
                        var existingMed = mmpu.FirstOrDefault(m => m.Nom == medToRemove.Medicament?.Nom);
                        if (existingMed != null)
                        {
                            // Update the quantity if the medicament already exists in the MissingMeds list
                            existingMed.Quantite = medToRemove.quantity;
                        }
                        else
                        {
                            // Add new entry if medicament is not already in MissingMeds
                            mmpu.Add(new MedicamentDTO
                            {
                                Nom = medToRemove.Medicament?.Nom ?? "[Unknown]",
                                Quantite = medToRemove.quantity,
                                Categorie = medToRemove.Medicament.categorie?.Name ?? "autre"
                                
                            });
                        }

                        Console.WriteLine($"MarkMedicamentAsMissingInPaniersAsync missing med added/updated with quantity {medToRemove.quantity}");

                        // Update the panier's MissingMeds list
                        panier.MissingMeds = mmpu;

                        // Remove the MedPanier and the corresponding medicament
                        panier.medPaniers.Remove(medToRemove);
                        _context.MedPaniers.Remove(medToRemove);
                    }
                }

                await _context.SaveChangesAsync(); // Save changes after modifying MissingMeds
            }
            else
            {
                Console.WriteLine($"MarkMedicamentAsMissingInPaniersAsync medicament {med?.Nom} not found, no action needed.");
            }
        }




        private List<MedicamentDTO> CheckMissingMeds(List<MedicamentDTO> medsList)
        {
            var missingMeds = new List<MedicamentDTO>();

            foreach (var med in medsList)
            {
                var medDb = _context.Medicaments.FirstOrDefault(m => m.Nom == med.Nom);
                if (medDb == null)
                {
                    missingMeds.Add(new MedicamentDTO { Nom = med.Nom, Quantite = med.Quantite, Categorie = med.Categorie });
                }
                else if (medDb.Nbr_stock < med.Quantite)
                {
                    missingMeds.Add(new MedicamentDTO { Nom = med.Nom, Quantite = med.Quantite - medDb.Nbr_stock , Categorie = med.Categorie});
                }
            }

            return missingMeds;
        }



        public async Task<bool> ChangePanierStatusAsync(Guid panierId)
        {
            var panier = await _context.Paniers
                .FirstOrDefaultAsync(p => p.Id == panierId);

            if (panier == null)
            {
                return false; 
            }

            panier.state = "supprime";
            panier.DateValidation = DateTime.Now;

            await _context.SaveChangesAsync();

            return true; 
        }

        public List<MonthlyMeds> GetMonthlyMedCounts(List<Panier> paniers)
        {
            return paniers
                .Where(p => (p.state == "valide" || p.state == "incomplet") && p.DateValidation.HasValue)
                .GroupBy(p => new DateTime(p.DateValidation.Value.Year, p.DateValidation.Value.Month, 1))
                .OrderBy(g => g.Key)
                .Select(g =>
                {
                    // Count validated meds per category
                    var validatedCategoryCounts = g
                        .Where(p => p.medPaniers != null)
                        .SelectMany(p => p.medPaniers)
                        .GroupBy(mp => mp.Medicament?.categorie?.Name ?? "autre")
                        .ToDictionary(
                            grp => grp.Key,
                            grp => grp.Sum(mp => mp.quantity)
                        );

                    var topValidatedCategory = validatedCategoryCounts
                        .OrderByDescending(kvp => kvp.Value)
                        .FirstOrDefault().Key ?? "aucune";

                    int validatedMeds = validatedCategoryCounts.Values.Sum();

                    // Count missing meds per category
                    var missingCategoryCounts = g
                        .Where(p => p.state == "incomplet")
                        .SelectMany(p =>
                        {
                            try
                            {
                                return JsonSerializer.Deserialize<List<MedicamentDTO>>(p.MissingMedsJson) ?? new List<MedicamentDTO>();
                            }
                            catch
                            {
                                return new List<MedicamentDTO>();
                            }
                        })
                        .GroupBy(m => m.Categorie ?? "autre")
                        .ToDictionary(
                            grp => grp.Key,
                            grp => grp.Sum(m => m.Quantite)
                        );

                    var topMissingCategory = missingCategoryCounts
                        .OrderByDescending(kvp => kvp.Value)
                        .FirstOrDefault().Key ?? "aucune";

                    int missingMeds = missingCategoryCounts.Values.Sum();

                    return new MonthlyMeds
                    {
                        Month = g.Key.ToString("yyyy-MM"),
                        ValidatedMedsCount = validatedMeds,
                        MissingMedsCount = missingMeds,
                        TopValidatedCategory = topValidatedCategory,
                        TopMissingCategory = topMissingCategory
                    };
                })
                .ToList();
        }



    }
}
