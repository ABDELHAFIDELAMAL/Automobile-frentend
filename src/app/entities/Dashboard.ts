
export interface Dashboard {
  reçuesAujourdhui: number;
  enDiagnostic: number;
  enRéparation: number;
  terminées: number;
  chargeParMécanicien: Record<number, number>;
  retardsRestitution: any[];
}
