import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { listarRutinas } from "@/api/rutinas";

export function RutinasPage() {
  const { data: rutinas, isLoading } = useQuery({
    queryKey: ["rutinas"],
    queryFn: listarRutinas,
  });
  const [enfoqueSeleccionado, setEnfoqueSeleccionado] = useState<string | null>(null);

  if (isLoading) return <p className="text-white/60">Cargando rutinas...</p>;

  if (!rutinas || rutinas.length === 0) {
    // CU13 - Flujo de excepción: usuario sin rutinas asignadas
    return (
      <div className="rounded-lg bg-brand-surface p-6 text-center text-white/70">
        No tenés rutinas asignadas. Contactá a tu profesor.
      </div>
    );
  }

  const rutina = rutinas[0]; // rutina activa más reciente
  const enfoques = Array.from(new Set(rutina.cronograma.map((c) => c.enfoque)));
  const enfoqueActivo = enfoqueSeleccionado ?? enfoques[0];

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Mis rutinas</h1>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {enfoques.map((enfoque) => (
          <button
            key={enfoque}
            onClick={() => setEnfoqueSeleccionado(enfoque)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${
              enfoqueActivo === enfoque
                ? "bg-brand-accent text-black"
                : "bg-brand-surface text-white/60"
            }`}
          >
            {enfoque}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rutina.ejercicios.map((ejercicio) => (
          <Link
            key={ejercicio.id}
            to={`/rutinas/ejercicio/${ejercicio.id}`}
            state={{ ejercicio }}
            className="flex items-center gap-3 rounded-xl bg-brand-surface p-3"
          >
            <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-white/10" />
            <div className="flex-1">
              <p className="font-medium">{ejercicio.nombre_ejercicio}</p>
              <p className="text-xs text-white/50">
                {ejercicio.series.length} series x{" "}
                {ejercicio.series[0]?.cantidad ?? "-"} repeticiones
              </p>
            </div>
            <span className="text-white/30">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
