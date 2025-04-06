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
  if (!user?.roles?.length) {
    return <Navigate to="/default-member-page" />;
  }
  if (roles && !roles.some((r) => user?.roles?.includes(r))) {
    return <Navigate to="/default-member-page" />;
  }

  return <Outlet />;
};

export default RequireAuth;
