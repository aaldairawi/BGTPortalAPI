type ADMIN_LINKS = "UNIT" | "ADMIN";
type NORMAL_USER_LINKS = "SAP" | "STRIPPING";
export type Links = ADMIN_LINKS | NORMAL_USER_LINKS;

export interface ILinks {
  path: string;
  text: ADMIN_LINKS | NORMAL_USER_LINKS;
}

export interface Props {
  links: ILinks[];
}

const versionPrefix = "/v1";

export const rightLinks: ILinks[] = [
  { path: `${versionPrefix}/stripping-units`, text: "STRIPPING" },
  { path: `${versionPrefix}/sap-integration`, text: "SAP" },
  { path: `${versionPrefix}/n4api`, text: "UNIT" },
  { path: `${versionPrefix}/admin`, text: "ADMIN" },
];
