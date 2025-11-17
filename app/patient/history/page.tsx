"use client";

import React, { useEffect, useState } from "react";
import { Download, CalendarDays, ArrowLeftRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation"; // IMPORTANTE
import HistoryService from "@/app/services/historyService";
import { getUserId } from "@/app/utilities/session";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import Alert from "@/components/alert";

type Row = {
  consultationId: number;
  fechaInicioConsulta: string;
  fechaFinConsulta?: string | null;
  doctorFullName?: string | null;
  doctorId?: number;
  estadoId: number;
  diagnosisName?: string | null;
  diagnosisObservation?: string | null;
  treatmentDescription?: string | null;
  medicationIds?: string | null;
  examIds?: string | null;
  triageId?: number;
};

export default function PatientHistoryPage() {
  const router = useRouter(); // ⬅️ NECESARIO PARA router.push()

  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState<string>("2025-10-01");
  const [to, setTo] = useState<string>("2025-11-30");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const userId = Number(getUserId());

  const priorityBadgeFor = (estadoId: number) => {
    if (estadoId === 2) {
      return (
        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
          Finalizada
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
        En espera
      </span>
    );
  };

  const fetchHistory = async (p = 1) => {
    setLoading(true);
    setAlert(null);
    try {
      if (!userId) throw new Error("No se encontró sesión activa");
      const resp = await HistoryService.getPatientHistory(
        userId,
        from || undefined,
        to || undefined,
        p,
        limit
      );
      setRows(resp.data || []);
      setTotal(resp.meta?.total || 0);
      setPage(resp.meta?.page || p);
    } catch (err: any) {
      console.error("Error fetching history", err);
      setAlert({
        type: "error",
        message: err?.message || "Error al obtener historial",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setLoading(true);
      const blob = await HistoryService.downloadHistoryPdf(
        userId,
        from || undefined,
        to || undefined
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `historial_${userId}_${from || "desde"}_${to || "hasta"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setAlert({ type: "success", message: "PDF generado correctamente." });
    } catch {
      setAlert({ type: "error", message: "No se pudo generar el PDF." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-700" />
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800">
                Historial de Atención
              </h1>
              <p className="text-sm text-gray-500">
                Consulta tus atenciones pasadas y descarga tu historial en PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
              onClick={() => {
                setFrom("");
                setTo("");
                fetchHistory(1);
              }}
            >
              Limpiar
            </Button>

            <Button
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center"
              onClick={handleDownloadPdf}
              disabled={loading}
            >
              <Download className="w-4 h-4 mr-2" />{" "}
              {loading ? "Generando..." : "Descargar PDF"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-gray-600" /> Filtrar por
              fecha
            </h2>

            <div className="text-sm text-gray-500">
              Registros:{" "}
              <span className="font-semibold text-gray-700">{total}</span>
            </div>
          </div>

          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label
                htmlFor="fechaDesdeInput"
                className="block text-xs text-gray-600"
              >
                Desde
              </label>
              <input
                id="fechaDesdeInput"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="fechaHastaInput"
                className="block text-xs text-gray-600"
              >
                Hasta
              </label>
              <input
                id="fechaHastaInput"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="ml-auto flex gap-2">
              <Button
                className="px-3 py-2 rounded border"
                onClick={() => {
                  setFrom("");
                  setTo("");
                  fetchHistory(1);
                }}
              >
                Limpiar
              </Button>
              <Button
                className="px-3 py-2 rounded bg-purple-600 text-white"
                onClick={() => fetchHistory(1)}
              >
                Aplicar
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            )}

            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Médico</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Diagnóstico</th>
                    <th className="p-3 text-left">Tratamiento</th>
                    <th className="p-3 text-left w-36">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gray-500">
                        No hay registros.
                      </td>
                    </tr>
                  )}

                  {rows.map((r) => (
                    <tr
                      key={r.consultationId}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {formatDate(r.fechaInicioConsulta)}
                      </td>
                      <td className="p-3">
                        {r.doctorFullName ?? `#${r.doctorId}`}
                      </td>
                      <td className="p-3">{priorityBadgeFor(r.estadoId)}</td>
                      <td className="p-3">{r.diagnosisName ?? "—"}</td>
                      <td className="p-3">{r.treatmentDescription ?? "—"}</td>

                      <td className="p-3">
                        <Button
                          className="px-2 py-1 border text-sm"
                          onClick={() =>
                            router.push(
                              `/patient/history/detail?consultation=${r.consultationId}&patientId=${userId}`
                            )
                          }
                        >
                          Ver
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, total)} de {total}
              </div>

              <div className="flex gap-2">
                <Button
                  className="px-3 py-1 border rounded"
                  onClick={() => fetchHistory(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  className="px-3 py-1 border rounded"
                  onClick={() => fetchHistory(page + 1)}
                  disabled={page * limit >= total}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <Card>
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Resumen rápido
            </h3>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>Total consultas</span>
                <strong>{total}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span>Consultas finalizadas</span>
                <strong>{rows.filter((r) => r.estadoId === 2).length}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span>Consultas en espera</span>
                <strong>{rows.filter((r) => r.estadoId !== 2).length}</strong>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full px-3 py-2 bg-purple-600 text-white"
                  onClick={() => fetchHistory(1)}
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" /> Actualizar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
