import { Link } from "react-router-dom";

const NoUserError = () => (
    <Link
      style={{ color: "white", fontSize: "2rem" }}
      to="/admin"
    >
      No User Loaded please select a user to update.
    </Link>
  );

  export default NoUserError;