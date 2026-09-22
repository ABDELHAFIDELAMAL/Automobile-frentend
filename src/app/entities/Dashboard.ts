import { Intervention } from './Interventions';

export interface Dashboard {
  receivedToday: number;
  inProgressDiagnostic: number;
  underRepair: number;
  completed: number;
  workloadPerMechanic: {
    [mecanicienId: string]: number;
  };
  delayedReturns: Intervention[];
}

