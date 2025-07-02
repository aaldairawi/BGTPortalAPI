export type StrippingContainer = {
  id: number;
  containerNumber: string;
  lineOperator: string;
  iso: string;
  size: string;
  dateStripped: string;
  laborType: StrippingLaborType;
  driverName: string;
  berth: string;
  final: boolean;
};

enum StrippingLaborType {
  BGT,
  Labor,
  IPA,
  Flat,
}

export type LaborType = {
  id: number;
  laborType: string;
};

export type StrippingContainerRequestData = {
  dateStripped: string;
  berth: string;
};

export type StrippingDriverDto = {
  id: number;
  name: string;
  creator: string;
};

export type StrippingDriverForContainer = Omit<StrippingDriverDto, "creator">;

export type CreateStrippingDriver = {
  name: string;
  creator: string;
};

export type StrippingLoadedDetails = {
  retiredContainersLength: number;
  strippedContainersLength: number;
};

export type UpdateRetiredContainersDto = {
  driverName: string;
  laborType: string;
  containers: string[];
  dateStripped?: string;
};

export interface StrippingDashboardDto {
  berth: string;
  laborType: string;
  shift20: number;
  shift40: number;
  shift45: number;
  total: number;
}

export const laborTypeMap: Record<number, string> = {
  1: "BGT",
  2: "IPA",
  3: "Labor",
  4: "Flat",
  8: "None",
};
