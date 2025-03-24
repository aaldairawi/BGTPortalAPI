import { IUpdateUserRole } from "../role/role";

export interface IUser {
  id: number;
  userName: string;
  email: string;
  roles: string[];
  token: string;
}
export interface IUserDto {
  id: number;
  userName: string;
  email: string;
  registered?: string;
  lastLoggedIn?: string;
  roles: string[];
}
export interface IUserRegister {
  userName: string;
  email: string;
  password: string;
}
export interface IUserPasswordUpdate {
  newPassword: string;
}
export interface IUserLogin {
  userName: string;
  password: string;
}

export interface ILoggedInUser {
  id: number;
  userName: string;
  email: string;
  token: string;
  roles: string[];
}

export interface IUpdateUserDto {
  userId: string;
  roles: IUpdateUserRole[];
  password: IUserPasswordUpdate;
}
