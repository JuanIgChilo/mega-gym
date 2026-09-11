import { useQuery } from "@tanstack/react-query";
import { listarAlumnos } from "@/api/admin";
import { TablaResponsive } from "@/components/ui/TablaResponsive";

/**
 * Base del CU12 (Modificar rutina) / CU02 (Gestionar plan de seguimiento):
 * listado de alumnos -> "Ver rutinas" -> detalle/edición.
 * Punto de partida: completar la navegación al detalle de rutina de cada alumno
 * (endpoint GET /rutinas/?usuario=<id> ya disponible en el backend).
 */
export function RutinasAdminPage() {
  const { data: alumnos, isLoading } = useQuery({
    queryKey: ["admin-alumnos"],
    queryFn: listarAlumnos,
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Rutinas por alumno</h1>
      <p className="mb-4 text-sm text-white/50">
        Seleccioná un alumno para crear o modificar su rutina (CU12).
      </p>

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
            {
              header: "Acción",
              render: () => <span className="text-brand-accent">Ver rutinas ›</span>,
            },
          ]}
        />
      )}
    </div>
  );
}
