import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Ejercicio } from "@/api/rutinas";

export function DetalleEjercicioPage() {
  const { state } = useLocation() as { state: { ejercicio: Ejercicio } };
  const navigate = useNavigate();
  const { id } = useParams();
  const ejercicio = state?.ejercicio;

  if (!ejercicio) {
    return (
      <div className="text-white/60">
        No se encontró el ejercicio #{id}.{" "}
        <button onClick={() => navigate(-1)} className="text-brand-accent underline">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="mb-4 text-white/60">
        ← Volver
      </button>

      <h1 className="mb-3 text-xl font-bold">{ejercicio.nombre_ejercicio}</h1>

      <div className="mb-4 aspect-video w-full rounded-xl bg-white/10" />

      {ejercicio.url_ejercicio && (
        <a
          href={ejercicio.url_ejercicio}
          target="_blank"
          rel="noreferrer"
          className="mb-4 block text-brand-accent underline"
        >
          Ver cómo realizar este ejercicio
        </a>
      )}

      <div className="space-y-2 rounded-xl bg-brand-surface p-4">
        <p>
          🔁 {ejercicio.series.length} series ・{" "}
          {ejercicio.series[0]?.cantidad ?? "-"} repeticiones
        </p>
        {ejercicio.accesorios.length > 0 && (
          <p>🛠️ {ejercicio.accesorios.map((a) => a.descripcion).join(", ")}</p>
        )}
      </div>

      <button className="mt-6 w-full rounded-lg bg-brand-accent py-3 font-semibold text-black">
        Marcar como realizado
      </button>
    </div>
  );
}
