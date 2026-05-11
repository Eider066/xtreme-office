import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Si NO hay token → redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token → permite entrar
  return children;
};

export default PrivateRoute;
