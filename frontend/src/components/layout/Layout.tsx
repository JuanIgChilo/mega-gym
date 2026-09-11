import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ItemNav {
  to: string;
  label: string;
  icono: string;
}

const navAlumno: ItemNav[] = [
  { to: "/rutinas", label: "Rutinas", icono: "🏋️" },
  { to: "/seguimiento", label: "Seguimiento", icono: "📈" },
  { to: "/perfil", label: "Perfil", icono: "👤" },
];

// Ítems base que ve cualquier profesor
const navProfesorBase: ItemNav[] = [
  { to: "/admin/alumnos", label: "Alumnos", icono: "🧑‍🤝‍🧑" },
  { to: "/admin/rutinas", label: "Rutinas", icono: "🏋️" },
  { to: "/admin/ejercicios", label: "Ejercicios", icono: "💪" },
  { to: "/admin/maquinas", label: "Máquinas", icono: "⚙️" },
  { to: "/perfil", label: "Perfil", icono: "👤" },
];

// Ítem extra que solo ve el super admin
const itemProfesores: ItemNav = { to: "/admin/profesores", label: "Profesores", icono: "🛡️" };

export function Layout() {
  const { usuario, salir } = useAuth();

  let items: ItemNav[];
  if (usuario?.rol === "profesor") {
    items = usuario.is_superuser
      ? [...navProfesorBase, itemProfesores] // super admin: base + "Profesores"
      : navProfesorBase;                      // profesor común: solo base
  } else {
    items = navAlumno;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar en desktop (md+), oculto en mobile */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-white/10 md:bg-brand-surface md:p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <span className="text-2xl">🏋️</span>
          <span className="text-lg font-bold">Mega Gym</span>
        </div>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-accent/20 text-brand-accent"
                    : "text-white/70 hover:bg-white/5"
                }`
              }
            >
              {item.icono} {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={salir}
          className="mt-auto rounded-lg px-3 py-2 text-left text-sm text-white/50 hover:bg-white/5"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Header mobile */}
      <header className="flex items-center justify-between border-b border-white/10 bg-brand-surface px-4 py-3 md:hidden">
        <span className="font-semibold">
          Hola, <span className="text-brand-accent">{usuario?.first_name}</span>
        </span>
        <button onClick={salir} className="text-white/60">
          ⏻
        </button>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
        <Outlet />
      </main>

      {/* Bottom nav en mobile, oculto en desktop */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-white/10 bg-brand-surface py-2 md:hidden">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 text-xs ${
                isActive ? "text-brand-accent" : "text-white/50"
              }`
            }
          >
            <span className="text-lg">{item.icono}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}