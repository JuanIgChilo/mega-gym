import { api } from "./client";

// --- Usuarios (alumnos) ---
export async function listarAlumnos() {
  const { data } = await api.get("/usuarios/");
  return (data.results ?? data).filter((u: any) => u.rol === "alumno");
}

export async function crearAlumno(payload: any) {
  const { data } = await api.post("/usuarios/", { ...payload, rol: "alumno" });
  return data;
}

// --- Profesores (solo gestionables por el super admin) ---
export async function listarProfesores() {
  const { data } = await api.get("/usuarios/?rol=profesor");
  return data.results ?? data;
}

export async function crearProfesor(payload: any) {
  const { data } = await api.post("/usuarios/", { ...payload, rol: "profesor" });
  return data;
}

// --- Ejercicios ---
export async function listarEjerciciosAdmin() {
  const { data } = await api.get("/ejercicios/");
  return data.results ?? data;
}

export async function crearEjercicio(payload: { nombre_ejercicio: string; url_ejercicio?: string }) {
  const { data } = await api.post("/ejercicios/", payload);
  return data;
}

// --- Máquinas ---
export async function listarMaquinas() {
  const { data } = await api.get("/maquinas/");
  return data.results ?? data;
}

export async function crearMaquina(payload: { nombre_maquina: string; estado: string }) {
  const { data } = await api.post("/maquinas/", payload);
  return data;
}

export async function modificarMaquina(id: number, payload: any) {
  const { data } = await api.patch(`/maquinas/${id}/`, payload);
  return data;
}

// --- Rutinas (admin) ---
export async function crearRutina(payload: any) {
  const { data } = await api.post("/rutinas/", payload);
  return data;
}
