export interface Message {
    id?: string;
    expediteurId?: string;
    destinataireId: string;
    content: string;
    sentAt: string;
  }
  