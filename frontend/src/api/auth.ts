import { api } from "./client";

export interface Usuario {
  id: number;
  username: string;
  first_name: string;
  apellido: string;
  dni: string;
  rol: "alumno" | "profesor";
  estado: "activo" | "inactivo";
  is_superuser: boolean;
}

export async function loginAlumno(dni: string) {
  const { data } = await api.post("/usuarios/auth/login-alumno/", { dni });
  return data as { access: string; refresh: string; usuario: Usuario };
}

export async function loginProfesor(username: string, password: string) {
  const { data } = await api.post("/usuarios/auth/login-profesor/", {
    username,
    password,
  });
  return data as { access: string; refresh: string };
}

export async function obtenerPerfil() {
  const { data } = await api.get("/usuarios/me/");
  return data as Usuario;
}
