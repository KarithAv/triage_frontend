"use client";

import { Button } from "@/components/button";

interface DashboardFiltersProps {
  filters: any;
  setFilters: any;
  onUpdate: () => void;
  loading: boolean;
  priorities: any[];
  doctors: any[];
  nurses: any[];
}

export default function DashboardFilters({
  filters,
  setFilters,
  onUpdate,
  loading,
  priorities,
  doctors,
  nurses,
}: DashboardFiltersProps) {
  const handleChange = (key: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 flex-wrap">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="text-sm font-semibold whitespace-nowrap">
          Filtrar por:
        </label>
      </div>
      <div className="flex flex-wrap gap-3 justify-center sm:justify-end w-full">
        {/* Contenedor de Fecha de Inicio */}
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm text-gray-700 mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        {/* Contenedor de Fecha de Fin */}
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm text-gray-700 mb-1">
            Fecha de fin
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        {/* Prioridades */}
        <select
          value={filters.priorityId ?? ""}
          onChange={(e) =>
            handleChange(
              "priorityId",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-purple-400 outline-none"
        >
          <option value="">Prioridades</option>
          {priorities.map((p) => (
            <option key={p.priorityId} value={p.priorityId}>
              {p.priorityName}
            </option>
          ))}
        </select>

        {/* Doctores */}
        <select
          value={filters.doctorId ?? ""}
          onChange={(e) =>
            handleChange(
              "doctorId",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-purple-400 outline-none"
        >
          <option value="">Médicos</option>
          {doctors.map((d) => (
            <option key={d.userId} value={d.userId}>
              {d.fullName}
            </option>
          ))}
        </select>

        {/* Enfermeros */}
        <select
          value={filters.nurseId ?? ""}
          onChange={(e) =>
            handleChange(
              "nurseId",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-purple-400 outline-none"
        >
          <option value="">Enfermeros</option>
          {nurses.map((n) => (
            <option key={n.userId} value={n.userId}>
              {n.fullName}
            </option>
          ))}
        </select>

        <Button
          onClick={onUpdate}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "Cargando..." : "Actualizar"}
        </Button>
      </div>
    </div>
  );
}
