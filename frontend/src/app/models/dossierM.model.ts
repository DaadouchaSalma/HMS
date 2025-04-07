export interface DossierMedical {
    id: string;
    matricule: number;
    sexe: string;
    maladies_antérieures: string[];
    maladies_familiaux: string[];
    chirurgies: string[];
    allergies: string[];
    vaccinations: string[];
    liste_analyse: string[];
  }