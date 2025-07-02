import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import Admin from "../../features/admin/AdminPanel";
import RequireAuth from "./RequireAuth";
import HomePageLogo from "../../features/home/HomepageLogo";
import SapIntegrationPanel from "../../features/sap/SapIntegrationPanel";
import NavisContainerAPIPanel from "../../features/navisunitapi/NavisContainerAPIPanel";
import { EditUserPage } from "../../features/admin/users/EditUserPage";
import StrippingUnitsPanel from "../../features/stripping/StrippingUnitsPanel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Protected: SAP
      {
        element: (
          <RequireAuth roles={["DubaiFinance", "Admin", "IraqFinance"]} />
        ),
        children: [
          { path: "v1/sap-integration", element: <SapIntegrationPanel /> },
        ],
      },

      // Protected: Admin and Finance roles
      {
        element: (
          <RequireAuth
            roles={[
              "Admin",
              "DubaiFinance",
              "Operations",
              "IraqFinance",
              "IraqBilling",
              "Guest",
            ]}
          />
        ),
        children: [
          { path: "v1/not-found", element: <NotFound /> },
          { path: "*", element: <Navigate to="/v1/not-found" replace /> },
        ],
      },

      // Protected: Admin only
      {
        element: <RequireAuth roles={["Admin"]} />,
        children: [
          { path: "v1/admin", element: <Admin /> },
          { path: "v1/edit/user/:userId", element: <EditUserPage /> },
          { path: "v1/n4api", element: <NavisContainerAPIPanel /> },
          { path: "v1/server-error", element: <ServerError /> },
        ],
      },

      // Protected: Admin and Operations
      {
        element: <RequireAuth roles={["Admin", "Operations"]} />,
        children: [
          { path: "v1/stripping-units", element: <StrippingUnitsPanel /> },
        ],
      },

      // Public routes
      { path: "v1/default-member-page", element: <HomePageLogo /> },
      { path: "v1/login", element: <Login /> },
      { path: "v1/register", element: <Register /> },
    ],
  },
]);

export default router;
