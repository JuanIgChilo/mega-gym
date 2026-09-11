import { useAuth } from "@/context/AuthContext";

export function PerfilPage() {
  const { usuario } = useAuth();

  if (!usuario) return null;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Mi perfil</h1>
      <div className="space-y-3 rounded-xl bg-brand-surface p-4">
        <Dato label="Nombre" valor={`${usuario.first_name} ${usuario.apellido}`} />
        <Dato label="DNI" valor={usuario.dni} />
        <Dato label="Rol" valor={usuario.rol === "profesor" ? "Profesor" : "Alumno"} />
        <Dato
          label="Estado"
          valor={usuario.estado === "activo" ? "Activo" : "Inactivo"}
        />
      </div>

      {usuario.rol === "alumno" && (
        <a
          href={`${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/socios/certificado/`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block w-full rounded-lg bg-brand-accent py-3 text-center font-semibold text-black"
        >
          Descargar certificado de socio activo
        </a>
      )}
    </div>
  );
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 last:border-0">
      <span className="text-white/50">{label}</span>
      <span>{valor}</span>
    </div>
  );
}
