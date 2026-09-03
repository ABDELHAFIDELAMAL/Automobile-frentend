import { Status } from '../enums/Status.enum';
import { TypeIntervention } from '../enums/TypeIntervention.enum';
import { Mecanicien } from './Mecanicien';
import { Vehicule } from './Vehicule';
import { Priorite } from '../enums/Priorite.enum';
import { Historique } from './Historique';


export interface Intervention {
  id : Number ;
  vehicule : Vehicule ;
  type : TypeIntervention ;
  description : String;
  diagnostic : String;
  status : Status ;
  priorite : Priorite;
  mecanicien : Mecanicien;
  coutEstime : number;
  dateDepot : Date ;
  dateRestitutionPrevue : Date ;
  dateCloture : Date;
  historique : Historique[] ;
}
