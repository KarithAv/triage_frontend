"use client";

import { Button } from "@/components/button";
import Alert from "@/components/alert";
import { useEffect, useState } from "react";
import TriageService from "@/app/services/triageService";
import { getUserId } from "@/app/utilities/session";

export default function PatientProfile({ isOpen, onClose, patient }: any) {
  const [prioridades, setPrioridades] = useState<any[]>([]);
  const [prioridadSeleccionada, setPrioridadSeleccionada] = useState<
    number | null
  >(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"info" | "error" | "success">(
    "info"
  );
  const [sugerenciaIA, setSugerenciaIA] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!patient?.triageId) return;

        // Obtener todas las prioridades
        const prioridadesData = await TriageService.getAllPriorities();
        setPrioridades(prioridadesData);

        if (patient.triageId) {
          const sugerenciaData = await TriageService.getTriageSuggestion(
            patient.triageId
          );
          setSugerenciaIA(sugerenciaData);
        }
      } catch (error: any) {
        console.error(error);
        setAlertType("error");
        setAlertMessage("Error al cargar los datos de la sugerencia.");
      }
    };

    fetchData();
  }, [patient]);

  if (!isOpen || !patient) return null;
  const handleRegistrarPrioridad = async () => {
    if (!prioridadSeleccionada) {
      setAlertType("error");
      setAlertMessage(
        "Debe seleccionar una nueva prioridad antes de registrar."
      );
      return;
    }

    try {
      const nurseId = getUserId();
      const response = await TriageService.registerTriageResult({
        TriageId: patient.triageId,
        PriorityId: prioridadSeleccionada,
        NurseId: nurseId,
        IsFinalPriority: true,
      });

      if (response.success) {
        setAlertType("success");
        setAlertMessage("Prioridad registrada correctamente ✅");
        setTimeout(() => {
          setAlertMessage("");
          onClose();
        }, 1500);
      } else {
        setAlertType("error");
        setAlertMessage(response.message || "Error al registrar prioridad.");
      }
    } catch (error) {
      console.error(error);
      setAlertType("error");
      setAlertMessage("Error al conectar con el servidor.");
    }
  };

  const colores: Record<string, string> = {
    Azul: "bg-blue-100 text-blue-700",
    Verde: "bg-green-100 text-green-700",
    Amarillo: "bg-yellow-100 text-yellow-700",
    Naranja: "bg-orange-100 text-orange-700",
    Rojo: "bg-red-100 text-red-700",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/40 backdrop-blur-sm">
      <div className="bg-white border border-black rounded-lg shadow-md p-6 w-[500px]">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Perfil del Paciente
        </h3>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Nombre:</strong> {patient.fullName}
          </p>
          <p>
            <strong>Sexo:</strong> {patient.gender}
          </p>
          <p>
            <strong>Edad:</strong> {patient.age} años
          </p>
          <p>
            <strong>Síntomas:</strong> {patient.symptoms}
          </p>

          {/* Prioridad actual */}
          <p>
            <strong>Prioridad actual:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${colores[patient.priorityName] || "bg-gray-100 text-gray-700"}`}
            >
              {patient.priorityName}
            </span>
          </p>

          {/* Prioridad sugerida por IA */}
          <div className="mt-3">
            <p>
              <strong>Prioridad sugerida por IA:</strong>
            </p>
            {!sugerenciaIA ? (
              <p className="text-gray-500 italic">Cargando sugerencia...</p>
            ) : (
              <>
                <p
                  className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${
                    colores[sugerenciaIA.priorityName] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {sugerenciaIA.priorityName}
                </p>
                <p className="text-gray-600 mt-1 italic">
                  {sugerenciaIA.priorityDescription}
                </p>
              </>
            )}
          </div>

          {/* Select de nueva prioridad */}
          <div className="mb-4">
            <label className="space-y-2 text-gray-700">
              Registrar nueva prioridad:
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={prioridadSeleccionada ?? ""}
              onChange={(e) => setPrioridadSeleccionada(Number(e.target.value))}
            >
              <option value="">Seleccione una prioridad</option>
              {prioridades.map((p) => (
                <option key={p.priorityId} value={p.priorityId}>
                  {p.priorityName} - {p.priorityDescription}
                </option>
              ))}
            </select>
          </div>

          <Alert
            message={alertMessage}
            type={alertType}
            onClose={() => setAlertMessage("")}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cerrar
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              onClick={handleRegistrarPrioridad}
            >
              Registrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
