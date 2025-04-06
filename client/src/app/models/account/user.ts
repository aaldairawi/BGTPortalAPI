import { ExistingUserRoleStatus, UpdateExistingUserRole } from "../role/role";

/** An interface representing a logged in users roles and other general information. Populated after the user is authenticated.
 * Roles may be undefined or an empty list when first registering in the app.
 */
export interface LoggedInUser {
  id: number;
  userName: string;
  email: string;
  token: string;
  roles?: string[];
}

/** An interface representing a user in the app. This interface is used for an Admin to populate the list of users when fetched or after creating a user.
 * Specifically using createEntityAdapter<UserDto>.
 */
export interface UserDto {
  id: number;
  userName: string;
  email: string;
  registered?: string;
  lastLoggedIn?: string;
}

export interface UserRegister {
  userName: string;
  email: string;
  password: string;
}

export interface AuthCredentials {
  userName: string;
  password: string;
}

/** An interface representing a users existing information in the app. Roles, username and other general information are populated when a request is made
 * to the back-end requesting the users information using his/her user Id.
 */
export interface UserAppInfo {
  roles: ExistingUserRoleStatus[];
  passwordPlaceHolder: string;
  userId: number;
  username: string;
  email: string;
  registered: string;
  lastLoggedIn: string;
}

export interface UpdateUserDto {
  userId: string;
  roles: UpdateExistingUserRole[];
  password: string;
}
