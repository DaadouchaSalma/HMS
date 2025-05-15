import { Admission } from "./admission.model";
import { MedicamentFactureDetail } from "./medicamentFactureDetail.model";
import { Patient } from "./patient.model";

export interface Facture {
  id: string;
  patientId: string;
  patient?: Patient;
  dateFacture: string; 
  totalMedicaments: number;
  totalChambre: number;
  totalGeneral: number;
  admission?:Admission;
  admissionId: string;
  medicamentsDetails: MedicamentFactureDetail[];
}