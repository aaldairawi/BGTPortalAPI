import { requests } from "./agent";

import {
  CreateStrippingDriver,
  StrippingContainer,
  StrippingContainerRequestData,
  UpdateRetiredContainersDto,
} from "../models/stripping/stripping.types";

const stripping = "stripping";

export const StrippingUnitsAPI = {
  getStrippedContainers: (
    strippedUnitsRequestedData: StrippingContainerRequestData
  ): Promise<StrippingContainer[]> => {
    return requests.post("stripping/get-stripped-containers", {
      dateStripped: strippedUnitsRequestedData.dateStripped,
      berth: strippedUnitsRequestedData.berth,
    });
  },
  getAllStrippingDrivers: () =>
    requests.get(`${stripping}/get-stripping-drivers`),
  getStrippingLaborTypes: () =>
    requests.get(`${stripping}/get-stripping-labors`),
  deleteStrippingDriver: (driverId: number) =>
    requests.delete(`${stripping}/delete-stripping-driver/${driverId}`),
  addStrippingDriver: (driverData: CreateStrippingDriver) =>
    requests.post(`${stripping}/create-stripping-driver`, {
      driverName: driverData.name,
      creator: driverData.creator,
    }),
  updateRetiredContainers: (data: UpdateRetiredContainersDto) =>
    requests.post(`${stripping}/update-retired-containers`, data),
};
