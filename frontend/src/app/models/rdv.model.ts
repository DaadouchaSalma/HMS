export class  RendezVous {
    id?: string=''; // Optionnel lors de la création
    date_RDV: string=''; // Format ISO 8601 "YYYY-MM-DDTHH:mm:ss"
    time_RDV:string='';
    etat?: string=''; // Valeur par défaut "En attente"
    patientId?: string='';
    medecinId: string='';
  }
