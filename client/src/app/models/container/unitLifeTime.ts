export interface IContainerImportDto {
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

export interface IContainerExportDto {
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
