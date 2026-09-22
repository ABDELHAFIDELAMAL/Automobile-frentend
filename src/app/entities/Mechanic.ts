import { Specialty } from '../enums/Specialty.enum';
import { Intervention } from './Interventions';


export interface Mechanic {
  id : number;
  name : string;
  specialty : Specialty;
  available : boolean;
  interventions : Intervention[];
}
