"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/app/utilities/session";
import PatientService from "@/app/services/patientService";
import AlertService from "@/app/services/alertService";
import { Card } from "@/components/card";
import Alert from "@/components/alert";
import {User, Zap, UserCheck, Clock, ClipboardList, Heart, Activity,
  Thermometer, Droplets, Wind,} from "lucide-react";

export default function PatientStatusPage() {
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    const fetchPatientStatus = async () => {
      try {
        const id = getUserId(); 
        if (!id) {
          setError("No se encontró una sesión activa.");
          return;
        }

        const response = await PatientService.getPatientStatus(id);

        if (response.success) {
          setPatientData(response.data);
        } else {
          setError(response.message || "No se pudo obtener el estado del paciente.");
        }
      } catch (err) {
        console.error("Error al obtener estado:", err);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientStatus();
  }, []);

  const handleNotify = async () => {
    const idPatient = getUserId();
    if (!idPatient) {
      setAlertType("error");
      setAlertMessage("No se pudo identificar al paciente logueado.");
      return;
    }

    try {
      const response = await AlertService.notifyDeterioration(idPatient);
      setAlertType("success");
      setAlertMessage(response);
    } catch (error) {
      console.error("Error al notificar empeoramiento:", error);
      setAlertType("error");
      setAlertMessage("Error al registrar la notificación de empeoramiento.");
    }finally {
        setLoading(false);
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-center text-gray-500 text-lg">
          Cargando estado del paciente...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-center text-purple-600 text-xl font-semibold mt-10">
          {error}
        </p>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-center text-gray-500 text-lg">
          No hay datos disponibles.
        </p>
      </div>
    );
  }

  const {
    fullName,
    priorityLevel,
    turnCode,
    nurseName,
    arrivalDate,
    symptoms,
    bloodPressure,
    temperature,
    heartRate,
    oxygenSaturation,
    respiratoryRate,
  } = patientData;

  const formatArrivalDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const datePart = date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return (
      <>
        {datePart}
        <br />
        {timePart}
      </>
    );
  };

  const getPriorityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "rojo":
        return "text-red-500";
      case "naranja":
        return "text-orange-400";
      case "amarillo":
        return "text-yellow-400 text-gray-800";
      case "verde":
        return "text-green-500";
      case "azul":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <>
      <Card>
        <h2 className=" flex justify-center items-center text-3xl font-extrabold text-gray-800">
          Mi estado en triage
        </h2>
      </Card>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      <div className="mt-6"></div>

          <Card className="shadow-2xl border-t-4 border-purple-500">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Estado de Triage</h2>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-extrabold text-lg shadow-inner">
               {turnCode}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 text-gray-700 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-bold">Paciente</p>
                  <p>{fullName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-bold">Nivel de Prioridad</p>
                  <p className={`font-extrabold ${getPriorityColor(priorityLevel)}`}>
                    {priorityLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-bold">Personal Asignado</p>
                  <p>{nurseName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-bold">Llegada</p>
                  <p className="text-xs">{formatArrivalDate(arrivalDate)}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="mt-6"></div>
          <Card className="border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-lg text-gray-800">Motivo de consulta</h3>
            </div>
            <p className="text-gray-700 text-base p-2 bg-blue-50 rounded-lg">
              {symptoms}
            </p>
          </Card>

          <div className="mt-6"></div>
          <Card className="border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-lg text-gray-800">Signos Vitales</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              <VitalSignItem
                icon={<Heart className="w-8 h-8 text-red-500" />}
                label="Frecuencia Cardiaca"
                value={`${heartRate} bpm`}
                valueColor="text-red-600"
              />

              <VitalSignItem
                icon={<Activity className="w-8 h-8 text-blue-500" />}
                label="Presión Arterial"
                value={bloodPressure}
                valueColor="text-blue-600"
              />

              <VitalSignItem
                icon={<Thermometer className="w-8 h-8 text-orange-500" />}
                label="Temperatura"
                value={`${temperature} °C`}
                valueColor="text-orange-600"
              />

              <VitalSignItem
                icon={<Droplets className="w-8 h-8 text-green-500" />}
                label="Saturación O₂"
                value={`${oxygenSaturation}%`}
                valueColor="text-green-600"
              />

              <VitalSignItem
                icon={<Wind className="w-8 h-8 text-teal-500" />}
                label="Frecuencia Respiratoria"
                value={`${respiratoryRate} rpm`}
                valueColor="text-teal-600"
              />
            </div>
          </Card>
          {/* 🔴 Botón flotante para notificar empeoramiento */}
          <button
            onClick={handleNotify}
            disabled={loading}
            className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-md"
          >
            {loading ? "Enviando..." : "🚨 Notificar Empeoramiento"}
          </button>
          </>
  );
}

const VitalSignItem = ({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor: string;
}) => (
  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow-sm">
    <div className="p-2 mb-2 rounded-full">{icon}</div>
    <p className="text-xs font-medium text-gray-600">{label}</p>
    <p className={`text-xl font-extrabold ${valueColor}`}>{value}</p>
  </div>
);