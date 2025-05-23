import { UserRegister, UpdateUserDto } from "../models/account/user.types";
import { requests } from "./agent";

export const UsersAPIRequests= {
  getall: () => requests.get("users/getall"),
  getUserToUpdate: (id: string) => requests.get(`users/${id}`),
  create: (userData: UserRegister) => requests.post("account/create", userData),
  edit: (object: UpdateUserDto) => {
    console.log("Edit called");
    return requests.put("users", {
      roles: object.roles,
      password: object.password,
      userId: object.userId,
    });
  },

  delete: (id: number) => requests.delete(`users/${id}`),
};
