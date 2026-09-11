import { Historique } from './Historique';

export interface DashboardStats {
  recuesAujourdhui: number;
  enDiagnostic: number;
  enReparation: number;
  terminees: number;

  chargeParMecanicien: {
    [mecanicienId: string]: number;
  };
  retardsRestitution: InterventionRetard[];
}

export interface InterventionRetard {
  id: number;
  type: string;
  description: string;
  diagnostic: string;
  status: string;
  priorite: string;
  coutEstime: number;
  dateDepot: string;
  dateRestitutionPrevue: string;
  dateCloture: string | null;
  historiqueInterventionList: Historique[];
}
