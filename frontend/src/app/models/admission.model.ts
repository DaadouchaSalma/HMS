import { Patient } from '../models/patient.model'
import { Chambre } from '../models/chambre.model'
export interface Admission {
    id:string;
    chambreId: string;
    patientId: string;
    patient:Patient;
    chambre:Chambre;
    dateAdmission: string;
    dateSortie:string;
    statut:string;
    motif: string;
  }
  