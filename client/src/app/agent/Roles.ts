import { IRole } from "../models/account/role";
import { requests } from "./agent";


export const Roles = {
  get: (): Promise<IRole[]> => {
    return requests.get("roles/getall");
  },
  delete: (roleId: number) => requests.delete(`roles/${roleId}`),
};

