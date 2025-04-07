import { MedicationPanier } from './medPanier.model';

export interface Panier {
  id?: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  medications: MedicationPanier[];
  missingMedications?: { medID: string; medName: string; quantity: number }[];
}