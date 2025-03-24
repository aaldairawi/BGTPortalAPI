import { toast } from "react-toastify";
import { useAppSelector } from "../store/configureStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface Props {
  roles?: string[];
}

const RequireAuth: React.FC<Props> = (props: Props) => {
  const { roles } = props;

  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  if (user.roles === undefined) {
    console.log("Requireauth user roles are undefined");
    return <Navigate to="/default-member-page" />;
  }
  if (roles && !roles.some((r) => user?.roles?.includes(r))) {
    console.log(roles);

    console.log(
      "Both statements are true no roles defined and the role passed is not true"
    );

    toast.error("Not authorized to access this area");
    return <Navigate to="/default-member-page" />;
  }
  return <Outlet />;
};

export default RequireAuth;
