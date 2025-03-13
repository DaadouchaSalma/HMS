export interface Medicament {
  id?: string;  // Make id optional
  nom: string;
  description: string;
  nbr_stock: number;
  compagnie: string;
  date_Exp: Date;
}
