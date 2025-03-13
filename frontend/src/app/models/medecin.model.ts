import { Personnel } from "./personnel.model";
export class Medecin extends Personnel {
    grad_med : string='' ;
    service : string='';

    constructor() {
      super(); // Appel du constructeur de Personnel sans paramètres
      // Les propriétés spécifiques à Medecin peuvent être initialisées ici
      this.grad_med = '';
      this.service = '';
    }
  }