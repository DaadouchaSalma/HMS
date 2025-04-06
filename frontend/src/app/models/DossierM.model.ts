export interface DossierM {
    id?: string;
    matricule: number;
    sexe?: string;
    maladies_anterieures?: string[];
    maladies_familiaux?: string[];
    chirurgies?: string[];
    allergies?: string[];
    vaccinations?: string[];
    contact_urg?: string[];
    note?: string[];
    liste_analyse?: string[];
    patientId?: string;
  }