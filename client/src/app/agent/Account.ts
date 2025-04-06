import { FieldValues } from "react-hook-form";
import { requests } from "./agent";
import { LoggedInUser } from "../models/account/user";


export  const Account = {
  login: (userData: FieldValues) : Promise<LoggedInUser> => requests.post("account/login", userData),
  
   
  register: (userData: FieldValues) : Promise<void> => requests.post("account/register", userData),

  getCurrentUser: () => requests.get("account/currentUser"),
};

