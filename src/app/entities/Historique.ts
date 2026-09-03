export interface Historique {
  id?: number;
  ancienStatus: string;
  nouveauStatus: string;
  commentaire?: string;
  date: string | Date;
  auteur: string;
}
