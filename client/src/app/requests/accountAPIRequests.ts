import { FieldValues } from "react-hook-form";
import { requests } from "../agent/agent";
import { LoggedInUser } from "../models/account/user.types";


export  const AccountAPIRequests = {
  login: (userData: FieldValues) : Promise<LoggedInUser> => requests.post("account/login", userData),
  
   
  register: (userData: FieldValues) : Promise<void> => requests.post("account/register", userData),

  getCurrentUser: () => requests.get("account/currentUser"),
};

