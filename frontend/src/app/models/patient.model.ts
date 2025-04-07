import { DossierMedical } from './dossierM.model';
export interface Patient {
    id?: string;
    nom: string;
    prenom: string;
    email: string;
    grp_Sang: string;
    password: string;
    date_Naiss: string;
    telephone: string;
    dossierMedical?: DossierMedical;
}
  