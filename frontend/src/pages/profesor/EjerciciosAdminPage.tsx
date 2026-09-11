import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crearEjercicio, listarEjerciciosAdmin } from "@/api/admin";
import { TablaResponsive } from "@/components/ui/TablaResponsive";

export function EjerciciosAdminPage() {
  const queryClient = useQueryClient();
  const { data: ejercicios, isLoading } = useQuery({
    queryKey: ["admin-ejercicios"],
    queryFn: listarEjerciciosAdmin,
  });
  const [nombre, setNombre] = useState("");
  const [url, setUrl] = useState("");

  const crear = useMutation({
    mutationFn: () => crearEjercicio({ nombre_ejercicio: nombre, url_ejercicio: url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ejercicios"] });
      setNombre("");
      setUrl("");
    },
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Ejercicios</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          crear.mutate();
        }}
        className="mb-6 flex flex-col gap-3 rounded-xl bg-brand-surface p-4 sm:flex-row"
      >
        <input
          placeholder="Nombre del ejercicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 rounded-lg bg-brand-bg px-3 py-2 outline-none ring-1 ring-white/10"
          required
        />
        <input
          placeholder="URL (video/instrucciones)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-lg bg-brand-bg px-3 py-2 outline-none ring-1 ring-white/10"
        />
        <button
          type="submit"
          disabled={crear.isPending}
          className="rounded-lg bg-brand-accent px-4 py-2 font-semibold text-black disabled:opacity-50"
        >
          Agregar
        </button>
      </form>

      {isLoading ? (
        <p className="text-white/60">Cargando...</p>
      ) : (
        <TablaResponsive
          items={ejercicios ?? []}
          keyExtractor={(e: any) => e.id}
          vacio="No hay ejercicios cargados."
          columnas={[
            { header: "Nombre", render: (e: any) => e.nombre_ejercicio },
            { header: "URL", render: (e: any) => e.url_ejercicio || "-" },
          ]}
        />
      )}
    </div>
  );
}
