"use client";

import { useEffect, useState } from "react";
import DashboardService from "@/app/services/dashboardService";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/card";
import DashboardFilters from "@/components/dashboardFilters";

const COLOR_MAP: Record<string, string> = {
  Rojo: "#f87171",
  Naranja: "#fbbf24ff",
  Verde: "#91ff00ff",
  Azul: "#60a5fa",
  Amarillo: "#fbff05ff",
};
export default function DashboardData() {
  const [priorities, setPriorities] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [nurses, setNurses] = useState<any[]>([]);

  const [avgTimes, setAvgTimes] = useState<any[]>([]);
  const [attentions, setAttentions] = useState<any[]>([]);
  const [priorityDist, setPriorityDist] = useState<any[]>([]);
  const [diagnosisFreq, setDiagnosisFreq] = useState<any[]>([]);

  const [loading, setLoading] = useState({
    avg: false,
    att: false,
    pri: false,
    diag: false,
  });

  const defaultFilter = {
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    priorityId: null as number | null,
    doctorId: null as number | null,
    nurseId: null as number | null,
  };

  const [filterAvg, setFilterAvg] = useState(defaultFilter);
  const [filterAtt, setFilterAtt] = useState(defaultFilter);
  const [filterPri, setFilterPri] = useState(defaultFilter);
  const [filterDiag, setFilterDiag] = useState(defaultFilter);

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

  const loadAvgTimes = async () => {
    setLoading((p) => ({ ...p, avg: true }));
    try {
      const res = await DashboardService.getAverageTimes(filterAvg);
      setAvgTimes(res || []);
    } catch (err) {
      console.error(err);
      setAvgTimes([]);
    } finally {
      setLoading((p) => ({ ...p, avg: false }));
    }
  };

  const loadAttentions = async () => {
    setLoading((p) => ({ ...p, att: true }));
    try {
      const res = await DashboardService.getAttentions(filterAtt);
      setAttentions(res || []);
    } catch (err) {
      console.error(err);
      setAttentions([]);
    } finally {
      setLoading((p) => ({ ...p, att: false }));
    }
  };

  const loadPriorityDist = async () => {
    setLoading((p) => ({ ...p, pri: true }));
    try {
      const res = await DashboardService.getPriorityDistribution(filterPri);
      setPriorityDist(res || []);
    } catch (err) {
      console.error(err);
      setPriorityDist([]);
    } finally {
      setLoading((p) => ({ ...p, pri: false }));
    }
  };

  const loadDiagnosisFreq = async () => {
    setLoading((p) => ({ ...p, diag: true }));
    try {
      const res = await DashboardService.getDiagnosisFrequency(filterDiag);
      setDiagnosisFreq(res || []);
    } catch (err) {
      console.error(err);
      setDiagnosisFreq([]);
    } finally {
      setLoading((p) => ({ ...p, diag: false }));
    }
  };

  useEffect(() => {
    loadAvgTimes();
    loadAttentions();
    loadPriorityDist();
    loadDiagnosisFreq();
  }, []);

  return (
    <div className="p-6 space-y-10">
      <Card>
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-4">
          Estadísticas
        </h2>
      </Card>

      {/* Tiempos Promedios */}
      <Card>
        <h3 className="text-xl font-bold mb-3 text-gray-700 text-center">
          Tiempos Promedios de Atención (minutos)
        </h3>
        <DashboardFilters
          filters={filterAvg}
          setFilters={setFilterAvg}
          onUpdate={loadAvgTimes}
          loading={loading.avg}
          priorities={priorities}
          doctors={doctors}
          nurses={nurses}
        />

        <div className="h-96 mt-6 flex items-center justify-center">
          {avgTimes.length === 0 ? (
            <p className="text-gray-500 font-medium">
              No hay datos para los filtros seleccionados.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={avgTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="waitingTime"
                  stroke="#3b82f6"
                  name="Tiempo de espera"
                />
                <Line
                  type="monotone"
                  dataKey="attentionTime"
                  stroke="#10b981"
                  name="Tiempo de atención"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Total Pacientes por Semana */}
      <Card>
        <h3 className="text-xl font-bold mb-3 text-gray-700 text-center">
          Total de Pacientes por Semana
        </h3>
        <DashboardFilters
          filters={filterAtt}
          setFilters={setFilterAtt}
          onUpdate={loadAttentions}
          loading={loading.att}
          priorities={priorities}
          doctors={doctors}
          nurses={nurses}
        />

        <div className="h-96 mt-6 flex items-center justify-center">
          {attentions.length === 0 ? (
            <p className="text-gray-500 font-medium">
              No hay datos para los filtros seleccionados.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attentions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalPatients"
                  fill="#ae00f3ff"
                  name="Pacientes"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/*Distribución por Prioridad */}
      <Card>
        <h2 className="flex justify-center items-center text-2xl font-bold text-gray-800">
          Distribución de Pacientes por Prioridad
        </h2>

        <DashboardFilters
          filters={filterPri}
          setFilters={setFilterPri}
          onUpdate={loadPriorityDist}
          loading={loading.pri}
          priorities={priorities}
          doctors={doctors}
          nurses={nurses}
        />

        <div className="h-96 mt-6 flex items-center justify-center">
          {priorityDist.length === 0 ? (
            <p className="text-gray-500 font-medium">
              No hay datos para los filtros seleccionados.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityDist}
                  dataKey="percentage"
                  nameKey="priorityName"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(entry: any) =>
                    `${entry.priorityName}: ${
                      entry.totalPatients
                    } pacientes (${entry.percentage.toFixed(1)}%)`
                  }
                >
                  {priorityDist.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLOR_MAP[entry.priorityName] || "#ccc"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: string, props: any) => [
                    `${props.payload.totalPatients} pacientes`,
                    name,
                  ]}
                />
                <Legend
                  formatter={(value: string) => (
                    <span style={{ color: COLOR_MAP[value] || "#000" }}>
                      {value}
                    </span>
                  )}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {/* Frecuencia de Diagnósticos */}
      <Card>
        <h3 className="text-xl font-bold mb-3 text-gray-700 text-center">
          Frecuencia de Diagnósticos
        </h3>
        <DashboardFilters
          filters={filterDiag}
          setFilters={setFilterDiag}
          onUpdate={loadDiagnosisFreq}
          loading={loading.diag}
          priorities={priorities}
          doctors={doctors}
          nurses={nurses}
        />

        <div className="h-96 mt-6 flex items-center justify-center">
          {diagnosisFreq.length === 0 ? (
            <p className="text-gray-500 font-medium">
              No hay datos para los filtros seleccionados.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diagnosisFreq}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="diagnosisName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalOccurrences" fill="#ec4899" name="Casos" />
                <Bar
                  dataKey="percentage"
                  fill="#06b6d4"
                  name="Porcentaje (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
