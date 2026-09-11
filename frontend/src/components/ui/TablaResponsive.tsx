import { ReactNode } from "react";

export interface Columna<T> {
  header: string;
  render: (item: T) => ReactNode;
}

interface Props<T> {
  items: T[];
  columnas: Columna<T>[];
  keyExtractor: (item: T) => string | number;
  vacio?: string;
}

/**
 * Tabla en desktop (md+), cards apiladas en mobile.
 * Ver tip de RNF.5 (multiplataforma) del roadmap: evita scroll horizontal en mobile.
 */
export function TablaResponsive<T>({ items, columnas, keyExtractor, vacio }: Props<T>) {
  if (items.length === 0) {
    return <p className="text-white/50">{vacio ?? "No hay registros."}</p>;
  }

  return (
    <>
      {/* Vista tabla - desktop */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-white/10 text-white/50">
            {columnas.map((col) => (
              <th key={col.header} className="pb-2 pr-4 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={keyExtractor(item)} className="border-b border-white/5">
              {columnas.map((col) => (
                <td key={col.header} className="py-3 pr-4">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Vista cards - mobile */}
      <div className="space-y-2 md:hidden">
        {items.map((item) => (
          <div key={keyExtractor(item)} className="rounded-lg bg-brand-surface p-3">
            {columnas.map((col) => (
              <div key={col.header} className="flex justify-between py-1 text-sm">
                <span className="text-white/50">{col.header}</span>
                <span>{col.render(item)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
