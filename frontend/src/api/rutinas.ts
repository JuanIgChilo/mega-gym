import { api } from "./client";

export interface Ejercicio {
  id: number;
  nombre_ejercicio: string;
  url_ejercicio: string | null;
  series: { id: number; cantidad: number }[];
  pesos: { id: number; cantidad: number }[];
  accesorios: { id: number; descripcion: string }[];
}

export interface Cronograma {
  id: number;
  dia: string;
  enfoque: string;
}

export interface Rutina {
  id: number;
  usuario: number;
  fecha_inicio: string;
  objetivo: string;
  nivel: string;
  estado: string;
  ejercicios: Ejercicio[];
  cronograma: Cronograma[];
}

// RF.13: visualizar rutina (filtrado por usuario en el backend según el rol)
export async function listarRutinas() {
  const { data } = await api.get("/rutinas/");
  return (data.results ?? data) as Rutina[];
}

export async function obtenerRutina(id: number) {
  const { data } = await api.get(`/rutinas/${id}/`);
  return data as Rutina;
}
