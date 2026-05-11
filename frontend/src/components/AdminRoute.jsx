import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token → no es válido
    if (!token) {
      setValid(false);
      setChecking(false);
      return;
    }

    // Validación mínima del token (estructura JWT)
    const parts = token.split(".");
    if (parts.length !== 3) {
      localStorage.removeItem("token");
      setValid(false);
      setChecking(false);
      return;
    }

    // Si pasa validación básica → permitir
    setValid(true);
    setChecking(false);
  }, []);

  // Loading mientras valida
  if (checking) {
    return (
      <div className="text-white p-10 text-center">
        Verificando acceso...
      </div>
    );
  }

  // Si no es válido → redirigir
  if (!valid) {
    return <Navigate to="/login" replace />;
  }

  // Si es válido → mostrar contenido
  return children;
}
