"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import HistoryService from "@/app/services/historyService";
import { Card } from "@/components/card";
import { Button } from "@/components/button";

export default function ConsultationDetailPage() {
  const params = useSearchParams();
  const consultaId = params.get("consultation");
  const patientIdParam = params.get("patientId");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!consultaId) return;

    const fetch = async () => {
      try {
        // preferimos patientId del query si viene; si no, tomamos userId desde localStorage (token)
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
        const userId = patientIdParam ? Number(patientIdParam) : (storedUser ? Number(storedUser) : 0);

        if (!userId || isNaN(userId)) {
          console.warn("No se encontró patientId válido en query ni en localStorage");
          setData(null);
          return;
        }

        const resp = await HistoryService.getConsultationById(userId, Number(consultaId));
        // el servicio devuelve .data o ya devuelve el dto, según tu implementación; aquí asumimos que res.data es el DTO
        const dto = resp?.data ?? resp;

        // Normalizar medicationIds/examIds: pueden venir como "1,2,3" o como null o como ya array
        if (dto) {
          if (dto.medicationIds && typeof dto.medicationIds === "string") {
            dto.medicationIds = dto.medicationIds.split(",").map((s: string) => s.trim()).filter((x: string) => x);
          }
          if (dto.examIds && typeof dto.examIds === "string") {
            dto.examIds = dto.examIds.split(",").map((s: string) => s.trim()).filter((x: string) => x);
          }
        }

        setData(dto ?? null);
      } catch (err) {
        console.error("Error cargando detalle de consulta:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultaId, patientIdParam]);

  if (!consultaId) return <p className="p-4 text-gray-600">No se envió consultaId</p>;
  if (loading) return <p className="p-4 text-gray-600">Cargando detalle...</p>;
  if (!data) return <p className="p-4 text-gray-600">No se encontró información de la consulta</p>;

  const fmt = (iso?: string | null) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-6">
      <Card>
        <h1 className="text-2xl font-bold mb-4">Detalle de Consulta #{consultaId}</h1>

        <div className="space-y-3 text-gray-700">
          <p><b>Fecha inicio:</b> {fmt(data.fechaInicioConsulta)}</p>
          <p><b>Fecha fin:</b> {data.fechaFinConsulta ? fmt(data.fechaFinConsulta) : "—"}</p>
          <p><b>Doctor:</b> {data.doctorFullName ?? `#${data.doctorId ?? "—"}`}</p>
          <p><b>Diagnóstico:</b> {data.diagnosisName ?? "—"}</p>
          <p><b>Observación:</b> {data.diagnosisObservation ?? "—"}</p>
          <p><b>Tratamiento:</b> {data.treatmentDescription ?? "—"}</p>

          {Array.isArray(data.medicationIds) && data.medicationIds.length > 0 && (
            <p><b>Medicamentos:</b> {data.medicationIds.join(", ")}</p>
          )}
          {Array.isArray(data.examIds) && data.examIds.length > 0 && (
            <p><b>Exámenes:</b> {data.examIds.join(", ")}</p>
          )}

          {/* Si tu DTO trae los nombres en lugar de IDs, muéstralos. Si sólo trae IDs, luego puedes resolverlos en otro endpoint */}
          {data.medicationNames && <p><b>Medicamentos (nombres):</b> {Array.isArray(data.medicationNames) ? data.medicationNames.join(", ") : data.medicationNames}</p>}
          {data.examNames && <p><b>Exámenes (nombres):</b> {Array.isArray(data.examNames) ? data.examNames.join(", ") : data.examNames}</p>}
        </div>

        <div className="mt-6 flex gap-2">
          <Button className="px-4 py-2 border" onClick={() => window.history.back()}>
            Volver
          </Button>
        </div>
      </Card>
    </div>
  );
}
