import { Navigate, useLocation } from "react-router";

function ProtectedResetRoute({ children, requiredState }) {
  const location = useLocation();

  if (requiredState && !location.state) {
    return <Navigate to="/Forgetpassword" replace />;
  }

  return children;
}

export default ProtectedResetRoute;