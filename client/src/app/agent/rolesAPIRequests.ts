import { IRole } from "../models/account/role.types";
import { requests } from "./agent";


export const RolesAPIRequests = {
  get: (): Promise<IRole[]> => {
    return requests.get("roles/getall");
  },
  delete: (roleId: number) => requests.delete(`roles/${roleId}`),
};

