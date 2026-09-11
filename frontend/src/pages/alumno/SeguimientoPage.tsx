import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  crearSeguimiento,
  listarSeguimiento,
  modificarSeguimiento,
} from "@/api/seguimiento";

const OBJETIVOS = [
  { value: "perdida_peso", label: "Pérdida de peso" },
  { value: "incremento_muscular", label: "Incremento muscular" },
  { value: "recomposicion_corporal", label: "Recomposición corporal" },
  { value: "mantenimiento", label: "Mantenimiento" },
];

export function SeguimientoPage() {
  const queryClient = useQueryClient();
  const { data: planes, isLoading } = useQuery({
    queryKey: ["seguimiento"],
    queryFn: listarSeguimiento,
  });

  const [form, setForm] = useState({
    objetivo: "perdida_peso",
    peso_actual: "",
    peso_objetivo: "",
    fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_objetivo: "",
  });

  const plan = planes?.[0];

  const guardar = useMutation({
    mutationFn: () => {
      const payload = {
        objetivo: form.objetivo,
        peso_actual: Number(form.peso_actual),
        peso_objetivo: Number(form.peso_objetivo),
        fecha_inicio: form.fecha_inicio,
        fecha_objetivo: form.fecha_objetivo,
      };
      return plan ? modificarSeguimiento(plan.id, payload) : crearSeguimiento(payload);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seguimiento"] }),
  });

  if (isLoading) return <p className="text-white/60">Cargando...</p>;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Mi seguimiento</h1>

      {!plan && (
        <p className="mb-4 text-white/70">
          No hay plan de seguimiento asociado a este usuario.
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardar.mutate();
        }}
        className="space-y-3"
      >
        <select
          value={form.objetivo}
          onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
          className="w-full rounded-lg bg-brand-surface px-4 py-3 outline-none"
        >
          {OBJETIVOS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.1"
          placeholder="Peso actual (kg)"
          value={form.peso_actual}
          onChange={(e) => setForm({ ...form, peso_actual: e.target.value })}
          className="w-full rounded-lg bg-brand-surface px-4 py-3 placeholder-white/40 outline-none"
          required
        />

        <input
          type="number"
          step="0.1"
          placeholder="Peso objetivo (kg)"
          value={form.peso_objetivo}
          onChange={(e) => setForm({ ...form, peso_objetivo: e.target.value })}
          className="w-full rounded-lg bg-brand-surface px-4 py-3 placeholder-white/40 outline-none"
          required
        />

        <input
          type="date"
          value={form.fecha_objetivo}
          onChange={(e) => setForm({ ...form, fecha_objetivo: e.target.value })}
          className="w-full rounded-lg bg-brand-surface px-4 py-3 outline-none"
          required
        />

        <button
          type="submit"
          disabled={guardar.isPending}
          className="w-full rounded-lg bg-brand-accent py-3 font-semibold text-black disabled:opacity-50"
        >
          {plan ? "Guardar cambios" : "Nuevo plan de seguimiento"}
        </button>
      </form>
    </div>
  );
}
