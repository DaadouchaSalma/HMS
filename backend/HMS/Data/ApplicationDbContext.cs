using System;
using HMS.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext :  IdentityDbContext<ApplicationUser>
{
	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
	{
		
	}
	public DbSet<Chambre> Chambres { get; set; }
    public DbSet<DossierM> Dossiers { get; set; }
    public DbSet<Facture> Factures { get; set; }
    public DbSet<Medecin> Medecins { get; set; }
    public DbSet<Medicament> Medicaments { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Personnel> Personnels { get; set; }
    public DbSet<PersonnelAdministrative> Admins { get; set; }
    public DbSet<Pharmacien> Pharmaciens { get; set; }
    public DbSet<RendezVous> Rdv { get; set; }
    public DbSet<Visiteur> Visiteurs { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<Admission>Admissions { get; set; }
    public DbSet<Fournisseur> fournisseurs { get; set; }
    public DbSet<CategorieMedicament> categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        /* modelBuilder.Entity<RendezVous>()
             .HasOne(rv => rv.Patient) 
             .WithMany(p => p.RendezVous)
             .HasForeignKey(rv => rv.PatientId) 
             .OnDelete(DeleteBehavior.Cascade);

         modelBuilder.Entity<Patient>()
         .HasOne(p => p.Facture)  
         .WithOne(f => f.Patient) 
         .HasForeignKey<Facture>(f => f.PatientId)  
         .OnDelete(DeleteBehavior.Cascade);

         modelBuilder.Entity<Patient>()
             .HasOne(p => p.DossierMedical) 
             .WithOne(d => d.Patient)  
             .HasForeignKey<DossierM>(d => d.PatientId)  
             .OnDelete(DeleteBehavior.Cascade);

         modelBuilder.Entity<Patient>()
             .HasMany(p => p.Chambres)
             .WithMany(c => c.Patients);

         modelBuilder.Entity<FactureMedicament>()
            .HasKey(fm => new { fm.FactureId, fm.MedicamentId }); 

         modelBuilder.Entity<FactureMedicament>()
             .HasOne(fm => fm.Facture)
             .WithMany(f => f.FactureMedicaments)
             .HasForeignKey(fm => fm.FactureId);

         modelBuilder.Entity<FactureMedicament>()
             .HasOne(fm => fm.Medicament)
             .WithMany(m => m.FactureMedicaments)
             .HasForeignKey(fm => fm.MedicamentId);

         modelBuilder.Entity<RendezVous>()
         .HasOne(rv => rv.Medecin)  
         .WithMany(m => m.RendezVous)  
         .HasForeignKey(rv => rv.MedecinId)  
         .OnDelete(DeleteBehavior.Cascade);*/
        // Configurer TPT (Table Per Type)
        modelBuilder.Entity<Medecin>().ToTable("Medecins");
        modelBuilder.Entity<Pharmacien>().ToTable("Pharmaciens");

        base.OnModelCreating(modelBuilder);
    }

    
}
