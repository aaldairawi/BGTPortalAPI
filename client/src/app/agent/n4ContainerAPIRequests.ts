import { ContainerExportDto, ContainerImportDto } from "../models/container/container.types";
import { requests } from "./agent";


export const NavisUnitApi = {
  getUnitCurrentLocation: (unitNbr: string) =>
    requests.get(`containerlifetime/unitcurrentstatus/${unitNbr}`),
  getImportUnitLifeTime: (unitNumber: string): Promise<ContainerImportDto> =>
    requests.get(
      `containerlifetime/unitlifetimeimport?unitNumber=${unitNumber}&unitCategory=IMPORT`
    ),
  getExportUnitLifeTime: (unitNumber: string): Promise<ContainerExportDto> =>
    requests.get(
      `containerlifetime/unitlifetimeexport?unitNumber=${unitNumber}&unitCategory=EXPORT`
    ),
};
