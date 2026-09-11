import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crearMaquina, listarMaquinas, modificarMaquina } from "@/api/admin";
import { TablaResponsive } from "@/components/ui/TablaResponsive";

const ESTADOS = ["activo", "inactivo", "en_reparacion"];

export function MaquinasAdminPage() {
  const queryClient = useQueryClient();
  const { data: maquinas, isLoading } = useQuery({
    queryKey: ["admin-maquinas"],
    queryFn: listarMaquinas,
  });
  const [nombre, setNombre] = useState("");

  const crear = useMutation({
    mutationFn: () => crearMaquina({ nombre_maquina: nombre, estado: "activo" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-maquinas"] });
      setNombre("");
    },
  });

  const cambiarEstado = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      modificarMaquina(id, { estado }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-maquinas"] }),
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Máquinas</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          crear.mutate();
        }}
        className="mb-6 flex gap-3 rounded-xl bg-brand-surface p-4"
      >
        <input
          placeholder="Nombre de la máquina"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="flex-1 rounded-lg bg-brand-bg px-3 py-2 outline-none ring-1 ring-white/10"
          required
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
          items={maquinas ?? []}
          keyExtractor={(m: any) => m.id}
          vacio="No hay máquinas cargadas."
          columnas={[
            { header: "Nombre", render: (m: any) => m.nombre_maquina },
            {
              header: "Estado",
              render: (m: any) => (
                <select
                  value={m.estado}
                  onChange={(e) =>
                    cambiarEstado.mutate({ id: m.id, estado: e.target.value })
                  }
                  className="rounded bg-brand-bg px-2 py-1 text-sm outline-none ring-1 ring-white/10"
                >
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
