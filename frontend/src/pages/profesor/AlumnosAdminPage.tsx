import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crearAlumno, listarAlumnos } from "@/api/admin";
import { TablaResponsive } from "@/components/ui/TablaResponsive";

export function AlumnosAdminPage() {
  const queryClient = useQueryClient();
  const { data: alumnos, isLoading } = useQuery({
    queryKey: ["admin-alumnos"],
    queryFn: listarAlumnos,
  });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    apellido: "",
    dni: "",
    email: "",
  });

  const crear = useMutation({
    mutationFn: () => crearAlumno(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-alumnos"] });
      setMostrarForm(false);
      setForm({ username: "", password: "", first_name: "", apellido: "", dni: "", email: "" });
    },
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Alumnos</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-black"
        >
          {mostrarForm ? "Cancelar" : "+ Nuevo alumno"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crear.mutate();
          }}
          className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-brand-surface p-4 sm:grid-cols-2"
        >
          <Input label="Usuario" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
          <Input label="Contraseña" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <Input label="Nombre" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} />
          <Input label="Apellido" value={form.apellido} onChange={(v) => setForm({ ...form, apellido: v })} />
          <Input label="DNI" value={form.dni} onChange={(v) => setForm({ ...form, dni: v })} />
          <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <button
            type="submit"
            disabled={crear.isPending}
            className="col-span-full rounded-lg bg-brand-accent py-2.5 font-semibold text-black disabled:opacity-50"
          >
            Guardar alumno
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-white/60">Cargando...</p>
      ) : (
        <TablaResponsive
          items={alumnos ?? []}
          keyExtractor={(a: any) => a.id}
          vacio="No hay alumnos cargados todavía."
          columnas={[
            { header: "Nombre", render: (a: any) => `${a.first_name} ${a.apellido}` },
            { header: "DNI", render: (a: any) => a.dni },
            { header: "Estado", render: (a: any) => a.estado },
          ]}
        />
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-white/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-brand-bg px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-brand-accent"
        required
      />
    </label>
  );
}
