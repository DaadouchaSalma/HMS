export class Personnel {
    id?: string;
    nom: string ='';
    prenom: string ='';
    email : string ='' ;
    password : string ='' ;
    date_Naiss : string='';
    date_Emb : string='';
    salaire : number =0 ;
    telephone : number = 0;
    type : number =0;
    showDetails?: boolean;
    adresse: string='';
    statut : string =''
    passwordHash:string=''
    constructor() {
        // Initialisation des valeurs par défaut
      }
    
}