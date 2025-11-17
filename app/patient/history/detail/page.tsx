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

    const fetchData = async () => {
      try {
        setLoading(true);

        // preferir globalThis en lugar de window
        const storedUser = globalThis?.localStorage?.getItem("userId") ?? null;

        // Resolver ID sin ternarios anidados ni asignaciones redundantes
        let resolvedId: number | null = null;

        if (patientIdParam) {
          resolvedId = Number(patientIdParam);
        } else if (storedUser) {
          resolvedId = Number(storedUser);
        }

        if (resolvedId === null || Number.isNaN(resolvedId)) {
          console.warn("No se encontró patientId válido en query ni localStorage");
          setData(null);
          return;
        }

        const resp = await HistoryService.getConsultationById(
          resolvedId,
          Number(consultaId)
        );

        const dto = resp?.data ?? resp;

        if (dto) {
          if (typeof dto.medicationIds === "string") {
            dto.medicationIds = dto.medicationIds
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);   // ✔ reemplazo de arrow → Boolean
          }

          if (typeof dto.examIds === "string") {
            dto.examIds = dto.examIds
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);   // ✔ reemplazo de arrow → Boolean
          }
        }

        setData(dto ?? null);
      } catch (error) {
        console.error("Error cargando detalle de consulta:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultaId, patientIdParam]);

  if (!consultaId) return <p className="p-4 text-gray-600">No se envió consultaId</p>;
  if (loading) return <p className="p-4 text-gray-600">Cargando detalle...</p>;
  if (!data) return <p className="p-4 text-gray-600">No se encontró información de la consulta</p>;

  const format = (iso?: string | null) => {
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
        <h1 className="text-2xl font-bold mb-4">
          Detalle de Consulta #{consultaId}
        </h1>

        <div className="space-y-3 text-gray-700">
          <Detail label="Fecha inicio" value={format(data.fechaInicioConsulta)} />
          <Detail label="Fecha fin" value={format(data.fechaFinConsulta)} />
          <Detail
            label="Doctor"
            value={data.doctorFullName ?? `#${data.doctorId ?? "—"}`}
          />
          <Detail label="Diagnóstico" value={data.diagnosisName ?? "—"} />
          <Detail label="Observación" value={data.diagnosisObservation ?? "—"} />
          <Detail label="Tratamiento" value={data.treatmentDescription ?? "—"} />

          {Array.isArray(data.medicationIds) && data.medicationIds.length > 0 && (
            <Detail label="Medicamentos" value={data.medicationIds.join(", ")} />
          )}

          {Array.isArray(data.examIds) && data.examIds.length > 0 && (
            <Detail label="Exámenes" value={data.examIds.join(", ")} />
          )}

          {data.medicationNames && (
            <Detail
              label="Medicamentos (nombres)"
              value={
                Array.isArray(data.medicationNames)
                  ? data.medicationNames.join(", ")
                  : data.medicationNames
              }
            />
          )}

          {data.examNames && (
            <Detail
              label="Exámenes (nombres)"
              value={
                Array.isArray(data.examNames)
                  ? data.examNames.join(", ")
                  : data.examNames
              }
            />
          )}
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            className="px-4 py-2 border"
            onClick={() => globalThis?.history?.back()}
          >
            Volver
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* =============================
    COMPONENTE DETAIL (READONLY)
============================= */

interface DetailProps {
  readonly label: string;
  readonly value: string;
}

function Detail({ label, value }: DetailProps) {
  return (
    <p>
      <b>{label}:</b> {value}
    </p>
  );
}
