"use client";

import { useEffect, useState } from "react";
import DashboardService from "@/app/services/dashboardService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/card";
import { Button } from "@/components/button";

export default function DashboardData() {
  const [priorities, setPriorities] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    priorityId: null as number | null,
    doctorId: null as number | null,
    nurseId: null as number | null,
  });

  useEffect(() => {
    Promise.all([
      DashboardService.getPriorities(),
      DashboardService.getDoctors(),
      DashboardService.getNurses(),
    ]).then(([p, d, n]) => {
      setPriorities(p);
      setDoctors(d);
      setNurses(n);
    });
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await DashboardService.getDashboardData(filters);
      setData(response || []);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <h2 className=" flex justify-center items-center text-3xl font-extrabold text-gray-800">
          Estadisticas
        </h2>
      </Card>

      <Card>
   {/* 🔹 Filtros estilizados */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3 flex-wrap">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-semibold whitespace-nowrap">
              Filtrar por:
            </label>
          </div>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-end w-full">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-40 focus:ring-2 focus:ring-purple-400 outline-none"
            />

            <select
              value={filters.priorityId ?? ""}
              onChange={(e) =>
                handleFilterChange(
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

            <select
              value={filters.doctorId ?? ""}
              onChange={(e) =>
                handleFilterChange(
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

            <select
              value={filters.nurseId ?? ""}
              onChange={(e) =>
                handleFilterChange(
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
              onClick={loadData}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? "Cargando..." : "Actualizar"}
            </Button>
          </div>
        </div>

         <h2 className=" flex justify-center items-center text-3xl font-extrabold text-gray-800">
          Tiempos promedios de atención
         </h2>

        {/* 🔹 Gráfica */}
        <div className="h-96 mt-8">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="waitingTime" stroke="#3b82f6" name="Tiempo de espera(min)" />
                <Line type="monotone" dataKey="attentionTime" stroke="#10b981" name="Tiempo de atención(min)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No hay datos disponibles para los filtros seleccionados
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
