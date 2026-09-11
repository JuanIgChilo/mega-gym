import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: ReactNode;
  rolRequerido?: "alumno" | "profesor";
  soloSuperAdmin?: boolean;
}

export function RutaProtegida({ children, rolRequerido, soloSuperAdmin }: Props) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <div className="flex h-screen items-center justify-center text-white">Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  if (soloSuperAdmin && !usuario.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}