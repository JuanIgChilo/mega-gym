import { api } from "./client";

export interface Seguimiento {
  id: number;
  usuario: number;
  objetivo: string;
  fecha_inicio: string;
  fecha_objetivo: string;
  peso_actual: number;
  peso_objetivo: number;
}

export async function listarSeguimiento() {
  const { data } = await api.get("/seguimiento/");
  return (data.results ?? data) as Seguimiento[];
}

export async function crearSeguimiento(payload: Omit<Seguimiento, "id" | "usuario">) {
  const { data } = await api.post("/seguimiento/", payload);
  return data as Seguimiento;
}

export async function modificarSeguimiento(id: number, payload: Partial<Seguimiento>) {
  const { data } = await api.patch(`/seguimiento/${id}/`, payload);
  return data as Seguimiento;
}
