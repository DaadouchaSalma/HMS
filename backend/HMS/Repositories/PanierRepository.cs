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
                    var panierItem = new MedPanier
                    {
                        Id = Guid.NewGuid(),
                        quantity = med.Quantite,
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
                    quantity = m.Quantite
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

            if (panier == null)
            {
                return null;
            }

            var medsList = panier.medPaniers.Select(mp => new MedicamentDTO
            {
                Nom = mp.Medicament.Nom,
                Quantite = mp.quantity
            }).ToList();

            foreach (var m in medsList)
            {
                Console.WriteLine($" medicament liiiiiiiiiiiiiiiiiiiiiiiiiiisteeeeeeeeeeeeeee : ,  {m.Nom}, {m.Quantite}");
            }

            if (medsList.Any())
            {
                panier.MissingMeds = CheckMissingMeds(medsList);
            }

            foreach (var m in panier.MissingMeds)
            {
                Console.WriteLine($"missiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiing medicament : ,  {m.Nom}, {m.Quantite}");
            }

            foreach (var panierItem in panier.medPaniers)
            {
                var medicament = panierItem.Medicament;
                if (medicament != null)
                {
                    if (medicament.Nbr_stock >= panierItem.quantity)
                    {
                        medicament.Nbr_stock -= panierItem.quantity;
                        _context.MedPaniers.Remove(panierItem);
                    }
                    else
                    {
                        panierItem.quantity -= medicament.Nbr_stock;
                        medicament.Nbr_stock = 0;
                    }
                }
            }

            if (!panier.MissingMeds.Any())
            {
                _context.Paniers.Remove(panier);
                await _context.SaveChangesAsync();
                return new { message = "Panier validated and deleted as no missing meds." };
            }

            await _context.SaveChangesAsync();
            return new
            {
                message = "Stock validation complete.",
                missingMeds = panier.MissingMeds
            };
        }


        public async Task RefreshAllPaniersMissingMedsAsync()
        {
            var paniers = await _context.Paniers
                            .Include(p => p.medPaniers)
                            .ThenInclude(mp => mp.Medicament)
                            .Include(p => p.Patient)
                            .ToListAsync();
            if (paniers == null) return;
            foreach(var panier in paniers)
            {
                var updatedMissingMeds = new List<MedicamentDTO>();

                // Check for current medPaniers stock issues
                foreach (var item in panier.medPaniers)
                {
                    var med = await _context.Medicaments.FirstOrDefaultAsync(m => m.Id == item.medicamentID);
                    if (med == null)
                    {
                        updatedMissingMeds.Add(new MedicamentDTO
                        {
                            Nom = item.Medicament?.Nom ?? "Unknown",
                            Quantite = item.quantity
                        });
                    }
                    else if (med.Nbr_stock < item.quantity)
                    {
                        updatedMissingMeds.Add(new MedicamentDTO
                        {
                            Nom = med.Nom,
                            Quantite = item.quantity - med.Nbr_stock
                        });
                    }
                }

                foreach(var item in panier.MissingMeds)
                {
                     var medicExistant = panier.medPaniers.FirstOrDefault(m => m.Medicament.Nom.Equals(item.Nom, StringComparison.OrdinalIgnoreCase));
                    if(medicExistant == null)
                    {
                        var med = await _context.Medicaments.FirstOrDefaultAsync(m => m.Nom == item.Nom);
                        if(med != null)
                        {
                            panier.medPaniers.Add(new MedPanier
                            {
                                PanierId = panier.Id,
                                medicamentID = med.Id,
                                quantity = item.Quantite,
                                Medicament = med
                            });
                            if (med.Nbr_stock < item.Quantite)
                            {

                                item.Quantite = item.Quantite - med.Nbr_stock;
                                updatedMissingMeds.Add(item);
                                
                            }

                        }

                    }


                }
                // Replace MissingMeds with freshly calculated list
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
                                Quantite = medToRemove.quantity
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
                    missingMeds.Add(new MedicamentDTO { Nom = med.Nom, Quantite = med.Quantite });
                }
                else if (medDb.Nbr_stock < med.Quantite)
                {
                    missingMeds.Add(new MedicamentDTO { Nom = med.Nom, Quantite = med.Quantite - medDb.Nbr_stock });
                }
            }

            return missingMeds;
        }
    }
}
