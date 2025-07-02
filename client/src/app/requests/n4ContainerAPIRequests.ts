import { requests } from "../agent/agent";

const containerlifetime = "containerlifetime";

export const NavisUnitApi = {
  getUnitCurrentLocation: (unitNbr: string) =>
    requests.get(
      `${containerlifetime}/unitcurrentstatus?containerId=${unitNbr}`
    ),
  getImportUnitLifeTime: (unitNumber: string) =>
    requests.get(
      `${containerlifetime}/unitlifetimeimport?containerId=${unitNumber}`
    ),
  getExportUnitLifeTime: (unitNumber: string) =>
    requests.get(
      `${containerlifetime}/unitlifetimeexport?containerId=${unitNumber}`
    ),
};
