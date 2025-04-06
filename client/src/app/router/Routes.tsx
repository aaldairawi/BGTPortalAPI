import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import Admin from "../../features/admin/Admin";
import RequireAuth from "./RequireAuth";
import HomePageLogo from "../../features/home/HomepageLogo";
// import EditUserPage from "../../features/admin/EditUserPage";

import SapIntegrationPanel from "../../features/sap/SapIntegrationPanel";
import NavisContainerAPIPanel from "../../features/navisunitapi/NavisContainerAPIPanel";
import { EditUserPage } from "../../features/admin/EditUserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth roles={["DubaiBilling","Admin"]} />,
        children: [{ path: "sap-integration", element: <SapIntegrationPanel /> }],
      },
      {
        element: <RequireAuth roles={["Admin"]} />,
        children: [
          {
            path: "admin",
            element: <Admin />,
          },
          {
            path: "edit/user/:userId",
            element: <EditUserPage />,
          },

          { path: "n4api", element: <NavisContainerAPIPanel /> },
          { path: "server-error", element: <ServerError /> },
        ],
      },
      { path: "default-member-page", element: <HomePageLogo /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate to="/not-found" replace={true} /> },
    ],
  },
]);

export default router;
