"use client";
import { useState } from "react";
import { BarChart3, CalendarDays } from "lucide-react"; // Usamos CalendarDays para la configuración
import { Button } from "@/components/button"; // Importación asumida de tu librería de componentes
import { Card } from "@/components/card"; // Importación asumida de tu librería de componentes
import  DateInput from "@/components/dateInput";
import Alert from "@/components/alert";
import ReportService from "@/app/services/reportService";
import { getUserName } from "@/app/utilities/session";

export default function ReportesEstadisticasPage() {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");


  const handleGenerarReporte = async () => {
    setAlertMessage(""); 
    const userName = getUserName(); // ✅ Obtener desde sesión

    if (!userName) {
      throw new Error("No se encontró información del usuario en la sesión.");
    }

    if (!fechaInicio || !fechaFin) {
      setAlertMessage("Por favor, selecciona tanto la fecha de inicio como la fecha de fin.");
      setAlertType("error");
      return; 
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setAlertMessage("La fecha de inicio no puede ser posterior a la fecha de fin.");
      setAlertType("error");
      return; 
    }

    setIsLoading(true);
    try {
    const result = await ReportService.generarReporte(fechaInicio, fechaFin);

    setAlertMessage(result.message);
    setAlertType(result.success ? "success" : "error");
  } catch (error) {
    console.error(error);
    setAlertMessage("Ocurrió un error inesperado al generar el reporte.");
    setAlertType("error");
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
       <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      {/* Título Principal */}
      <div className="bg-white p-6 rounded-lg shadow-xl text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Reportes y Estadísticas
        </h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        {/* Encabezado del Bloque */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center text-lg font-bold text-gray-700">
            <CalendarDays className="w-5 h-5 mr-2 text-purple-600" />
            Configuración del Reporte
          </div>
        </div>

        {/* Formulario de Fechas */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <DateInput 
              id="fechaInicio"
              label="Fecha de Inicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />

            <DateInput
              id="fechaFin"
              label="Fecha de Fin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Botón Generar Reporte */}
      <div className="max-w-4xl mx-auto flex justify-end mt-6">
        <Button
          onClick={handleGenerarReporte}
          disabled={isLoading} 
          className="shadow-xl"
          style={{ backgroundColor: "#7C3AED", borderColor: "#7C3AED" }}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <BarChart3 className="w-5 h-5" />
          )}
          {isLoading ? "Generando..." : "Generar Reporte"}
        </Button>
      </div>
    </div>
  );
}