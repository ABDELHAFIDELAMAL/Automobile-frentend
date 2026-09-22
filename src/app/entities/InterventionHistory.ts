import { Status } from '../enums/Status.enum';

export interface InterventionHistory {
  id: number;
  oldStatus: Status;
  newStatus: Status;
  comment: string;
  date: string | Date;
  author: string;
}
