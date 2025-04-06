export interface Role {
  id: number;
  name: string;
  normalizedName: string;
}

export interface ExistingUserRoleStatus extends Role {
  status: boolean;
}

export interface UpdateExistingUserRole {
  role: string;
  status: boolean;
}
export interface ExistingRole {
  roleId: number;
  role: string;
  name: string;
}
