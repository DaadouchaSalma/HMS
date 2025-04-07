import {Fournisseur} from '../models/founisseur.model'
import {CategorieMedicament} from '../models/categorie.model'

export interface Medicament {
  id?: string;  // Make id optional
  nom: string;
  description?: string;
  nbr_stock: number;
  fournisseurId: String;
  fournisseur?: Fournisseur;
  date_Exp: Date;
  categorieId : string;
  categorie?: CategorieMedicament;
}

