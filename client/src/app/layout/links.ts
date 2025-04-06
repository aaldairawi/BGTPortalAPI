


type ADMIN_LINKS = "API" | "ADMIN";
type NORMAL_USER_LINKS = "SAP" | "STRIPPING";
export type Links = ADMIN_LINKS | NORMAL_USER_LINKS;


export interface ILinks {
  path: string;
  text: ADMIN_LINKS | NORMAL_USER_LINKS;
}

export interface Props {
    links: ILinks[];
  }
  
export const rightLinks: ILinks[] = [
  { path: "/stripping", text: "STRIPPING" },
  { path: "/sap-integration", text: "SAP" },
  { path: "/n4api", text: "API" },
  { path: "/admin", text: "ADMIN" },
];
