using System;
using HMS.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
	{
		
	}
	public DbSet<Chambre> Chambres { get; set; }
    public DbSet<DossierM> Dossiers { get; set; }
    public DbSet<Facture> Factures { get; set; }
    public DbSet<Medecin> Medecins { get; set; }
    public DbSet<Med_Mat> Med_Mats { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Personnel> Personnels { get; set; }
    public DbSet<PersonnelAdministrative> Admins { get; set; }
    public DbSet<Pharmacien> Pharmaciens { get; set; }
    public DbSet<RendezVous> Rdv { get; set; }
    public DbSet<Visiteur> Visiteurs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RendezVous>()
            .HasOne(rv => rv.Patient) 
            .WithMany(p => p.RendezVous)
            .HasForeignKey(rv => rv.PatientId) 
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Facture>()
           .HasOne(f => f.Patient)
           .WithMany(p => p.Factures)
           .HasForeignKey(f => f.PatientId)
           .OnDelete(DeleteBehavior.Cascade);
    
      modelBuilder.Entity<Patient>()
            .HasOne(p => p.DossierMedical) 
            .WithOne(d => d.Patient)  
            .HasForeignKey<DossierM>(d => d.PatientId)  
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Patient>()
            .HasOne(p => p.Chambre)
            .WithMany(c => c.Patients)
            .HasForeignKey(p => p.ChambreId)
            .OnDelete(DeleteBehavior.Cascade);
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
    }
    
}
