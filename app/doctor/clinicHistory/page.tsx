"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DoctorService from "@/app/services/doctorService";

export default function ClinicHistoryPage() {
  const params = useSearchParams();
  const idTriage = params.get("Triage");
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (idTriage) {
      DoctorService.getTriageDetails(Number(idTriage))
        .then((res) => {
          console.log("🩺 Respuesta del backend:", res);
          setPatient(res.data); // ✅ Accedemos a data
        })
        .catch((err) => {
          console.error("Error al cargar paciente:", err);
          setPatient(null);
        });
    }
  }, [idTriage]);

  if (!idTriage) {
    return (
      <div className="text-center text-gray-500">
        No hay paciente seleccionado
      </div>
    );
  }

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-4">Historia Clínica</h1>
      {patient ? (
        <div>
          <p>
            <strong>Nombre:</strong> {patient.patientName}
          </p>
          <p>
            <strong>Cédula:</strong> {patient.patientDocument}
          </p>
          {/* Aquí va tu formulario de historia clínica */}
        </div>
      ) : (
        <p>Cargando información del paciente...</p>
      )}
    </div>
  );
}
