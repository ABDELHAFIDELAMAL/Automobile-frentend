import { Vehicle } from './Vehicle';
import { InterventionType } from '../enums/InterventionType.enum';
import { Status } from '../enums/Status.enum';
import { Priority } from '../enums/Priority.enum';
import { InterventionHistory } from './InterventionHistory';


export interface Intervention {
  id?: number;
  vehicle?: Vehicle;
  vehicleId?: number;
  type: InterventionType;
  description?: string;
  diagnostic?: string;
  status?: Status;
  priority?: Priority;
  mechanicId?: number;
  estimatedCost?: number;
  depositDate?: string | Date;
  estimatedReturnDate?: string | Date;
  closureDate?: string | Date;
  interventionHistoryList?: InterventionHistory[];
}
