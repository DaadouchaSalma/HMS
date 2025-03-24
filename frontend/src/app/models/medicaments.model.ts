import {Fournisseur} from '../models/founisseur.model'
export interface Medicament {
  id?: string;  // Make id optional
  nom: string;
  description: string;
  nbr_stock: number;
  fournisseurId: String;
  date_Exp: Date;
  CategorieId : string;
}

