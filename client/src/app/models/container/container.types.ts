export interface UnitCurrentStatus {
  containerId: string
  unitTState: string
  unitCategory: string
  unitFreightKind: string
  unitLineOperator: string
  unitNameOps: string
  unitBerth: string

}

export interface ContainerImportDto {
  unitId: string;
  category: string;
  status: string;
  shippingLine?: string;
  vesselName?: string;
  vesselVoyage?: string;
  vesselATA?: string;
  containerDischarge?: string;
  loadedToTruck?: string;
  stripped?: string;
  gateOut?: string;
  received?: string;
  berth?: string;
}

export interface ContainerExportDto {
  unitId: string;
  category: string;
  status: string;
  shippingLine?: string;
  vesselName?: string;
  vesselVoyage?: string;
  receivedEmpty?: string;
  containerLoaded?: string;
  vesselCompleted?: string;
  berth?: string;
  unitStuffed?: string;
  receivedFull?: string;
}


