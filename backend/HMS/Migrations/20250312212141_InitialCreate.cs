using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HMS.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Chambres",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nb_lit = table.Column<int>(type: "int", nullable: false),
                    statut = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chambres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Medicaments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nbr_stock = table.Column<int>(type: "int", nullable: false),
                    Compagnie = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date_Exp = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicaments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    Grp_Sang = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Personnels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date_Naiss = table.Column<DateOnly>(type: "date", nullable: false),
                    Date_Emb = table.Column<DateOnly>(type: "date", nullable: false),
                    Salaire = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personnels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Visiteurs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prenom = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visiteurs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ChambrePatient",
                columns: table => new
                {
                    ChambresId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PatientsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChambrePatient", x => new { x.ChambresId, x.PatientsId });
                    table.ForeignKey(
                        name: "FK_ChambrePatient_Chambres_ChambresId",
                        column: x => x.ChambresId,
                        principalTable: "Chambres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChambrePatient_Patients_PatientsId",
                        column: x => x.PatientsId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Dossiers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    liste_pres = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    liste_analyse = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dossiers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dossiers_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Factures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Prix_admission = table.Column<double>(type: "float", nullable: false),
                    Prix_medecin = table.Column<double>(type: "float", nullable: false),
                    Prix_medicament = table.Column<double>(type: "float", nullable: false),
                    Prix_materiel = table.Column<double>(type: "float", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Factures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Factures_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Admins_Personnels_Id",
                        column: x => x.Id,
                        principalTable: "Personnels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Medecins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Grad_med = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    service = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medecins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Medecins_Personnels_Id",
                        column: x => x.Id,
                        principalTable: "Personnels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pharmaciens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pharmaciens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pharmaciens_Personnels_Id",
                        column: x => x.Id,
                        principalTable: "Personnels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FactureMedicament",
                columns: table => new
                {
                    FacturesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MedicamentsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactureMedicament", x => new { x.FacturesId, x.MedicamentsId });
                    table.ForeignKey(
                        name: "FK_FactureMedicament_Factures_FacturesId",
                        column: x => x.FacturesId,
                        principalTable: "Factures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactureMedicament_Medicaments_MedicamentsId",
                        column: x => x.MedicamentsId,
                        principalTable: "Medicaments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rdv",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Date_RDV = table.Column<DateTime>(type: "datetime2", nullable: false),
                    etat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MedecinId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DossierMId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rdv", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rdv_Dossiers_DossierMId",
                        column: x => x.DossierMId,
                        principalTable: "Dossiers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Rdv_Medecins_MedecinId",
                        column: x => x.MedecinId,
                        principalTable: "Medecins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rdv_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChambrePatient_PatientsId",
                table: "ChambrePatient",
                column: "PatientsId");

            migrationBuilder.CreateIndex(
                name: "IX_Dossiers_PatientId",
                table: "Dossiers",
                column: "PatientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FactureMedicament_MedicamentsId",
                table: "FactureMedicament",
                column: "MedicamentsId");

            migrationBuilder.CreateIndex(
                name: "IX_Factures_PatientId",
                table: "Factures",
                column: "PatientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rdv_DossierMId",
                table: "Rdv",
                column: "DossierMId");

            migrationBuilder.CreateIndex(
                name: "IX_Rdv_MedecinId",
                table: "Rdv",
                column: "MedecinId");

            migrationBuilder.CreateIndex(
                name: "IX_Rdv_PatientId",
                table: "Rdv",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "ChambrePatient");

            migrationBuilder.DropTable(
                name: "FactureMedicament");

            migrationBuilder.DropTable(
                name: "Pharmaciens");

            migrationBuilder.DropTable(
                name: "Rdv");

            migrationBuilder.DropTable(
                name: "Visiteurs");

            migrationBuilder.DropTable(
                name: "Chambres");

            migrationBuilder.DropTable(
                name: "Factures");

            migrationBuilder.DropTable(
                name: "Medicaments");

            migrationBuilder.DropTable(
                name: "Dossiers");

            migrationBuilder.DropTable(
                name: "Medecins");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Personnels");
        }
    }
}
