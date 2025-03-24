import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import NotFound from "../errors/NotFound";
import SapIntegration from "../../features/sap/SapIntegration";
import ServerError from "../errors/ServerError";
import Admin from "../../features/admin/Admin";
import RequireAuth from "./RequireAuth";
import NavisApi from "../../features/navisunitapi/NavisApi";
import HomePageLogo from "../../features/home/HomepageLogo";
import EditUserPage from "../../features/admin/EditUserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth roles={["DubaiBilling"]} />,
        children: [{ path: "/sap-integration", element: <SapIntegration /> }],
      },
      {
        element: <RequireAuth roles={["Admin"]} />,
        children: [
          {
            path: "/admin",
            element: <Admin />,
          },
          {
            path: "/edit/user/:userid",
            element: <EditUserPage />,
          },

          { path: "/n4api", element: <NavisApi /> },
          { path: "/sap-integration/admin", element: <SapIntegration /> },
          { path: "/server-error", element: <ServerError /> },
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
