"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import TriageService from "@/app/services/triageService";
import { getUserId } from "@/app/utilities/session";
import { useSearchParams, useRouter } from "next/navigation";

export default function SugerenciaIA() {
  const searchParams = useSearchParams();
  const idTriage = Number(searchParams.get("idTriage")); // obtener id del triage por query
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"info" | "error" | "success">(
    "info"
  );

  const [prioridades, setPrioridades] = useState<any[]>([]);
  const [sugerencia, setSugerencia] = useState<any>(null);
  const [prioridadSeleccionada, setPrioridadSeleccionada] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        //Obtener prioridades
        const prioridadesData = await TriageService.getAllPriorities();
        setPrioridades(prioridadesData);

        //Obtener sugerencia de IA
        if (idTriage) {
          const sugerenciaData =
            await TriageService.getTriageSuggestion(idTriage);
          setSugerencia(sugerenciaData);

          const prioridadEncontrada = prioridadesData.find(
            (p: any) => p.priorityName === sugerenciaData.priorityName
          );
          if (prioridadEncontrada) {
            setPrioridadSeleccionada(prioridadEncontrada.priorityId);
          }
        }
      } catch (error: any) {
        console.error(error);
        setAlertType("error");
        setAlertMessage("Error al cargar los datos de la sugerencia.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idTriage]);

  const handleConfirmar = async () => {
    if (prioridadSeleccionada === null) {
      setAlertType("error");
      setAlertMessage("Debe seleccionar una prioridad antes de confirmar.");
      return;
    }
    try {
      const nurseId = getUserId();
      const response = await TriageService.registerTriageResult({
        TriageId: Number(idTriage),
        PriorityId: prioridadSeleccionada,
        NurseId: nurseId,
        IsFinalPriority: false, // por ahora lo marcamos como falso
      });

      if (response.success) {
        // ✅ Actualiza el estado local con la prioridad seleccionada
        const prioridadElegida = prioridades.find(
          (p) => p.priorityId === prioridadSeleccionada
        );

        if (prioridadElegida) {
          setSugerencia({
            suggestedLevel: prioridadElegida.priorityName,
            confidence: sugerencia?.confidence || 0,
            message: prioridadElegida.priorityDescription,
          });
        }
        setAlertType("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          router.push(`/nurse/patients/patientsList`);
        }, 1200);
      } else {
        setAlertType("error");
        setAlertMessage("Error al registrar la prioridad.");
      }
    } catch (error: any) {
      console.error(error);
      setAlertType("error");
      setAlertMessage("Error al conectar con el servidor.");
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando datos...</p>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[url('/images/fondo.png')] bg-repeat p-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[500px]">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Sugerencia de IA
        </h2>
        {/* Mostrar la prioridad sugerida */}
        {sugerencia && (
          <div className="text-center mb-6">
            <div
              className={`font-semibold py-3 px-4 rounded-lg inline-block
              ${
                sugerencia.priorityName === "Azul"
                  ? "bg-blue-200 text-blue-800"
                  : sugerencia.priorityName === "Verde"
                    ? "bg-green-200 text-green-800"
                    : sugerencia.priorityName === "Amarillo"
                      ? "bg-yellow-200 text-yellow-800"
                      : sugerencia.priorityName === "Naranja"
                        ? "bg-orange-200 text-orange-800"
                        : sugerencia.priorityName === "Rojo"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-200 text-gray-700"
              }
            `}
            >
              {sugerencia.priorityName} <br />
              <span className="text-sm font-normal">
                {sugerencia.priorityDescription}
              </span>
            </div>
          </div>
        )}

        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")}
        />

        <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">
          Confirme o Ajuste Prioridad
        </h3>

        <div className="space-y-3">
          {prioridades.map((p) => {
            const colores: Record<string, string> = {
              Azul: "bg-blue-200 text-blue-900 border-blue-400",
              Verde: "bg-green-200 text-green-900 border-green-400",
              Amarillo: "bg-yellow-200 text-yellow-900 border-yellow-400",
              Naranja: "bg-orange-200 text-orange-900 border-orange-400",
              Rojo: "bg-red-200 text-red-900 border-red-400",
            };

            const seleccionado = prioridadSeleccionada === p.priorityId;

            return (
              <button
                key={p.priorityId}
                type="button"
                onClick={() => setPrioridadSeleccionada(p.priorityId)}
                className={`w-full cursor-pointer border-2 rounded-lg px-4 py-3 transition-all text-center font-medium
    ${colores[p.priorityName] || "bg-gray-100"}
    ${seleccionado ? "ring-4 ring-offset-1 ring-purple-500 scale-105" : "hover:scale-105"}
  `}
              >
                <p className="font-semibold">{p.priorityName}</p>
                <p className="text-sm">{p.priorityDescription}</p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleConfirmar}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Confirmar Registro
          </Button>
        </div>
      </div>
    </main>
  );
}
