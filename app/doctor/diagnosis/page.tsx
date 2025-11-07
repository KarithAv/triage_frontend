"use client";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Heart,
  Thermometer,
  Activity,
  Droplets,
  Wind,
  Calendar,
  Stethoscope,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DiagnosisService from "@/app/services/diagnosisService";
import DoctorService from "@/app/services/doctorService";
import Alert from "@/components/alert";
import Table from "@/components/table";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import Badge from "@/components/badge";

export default function DiagnosysPage() {
  const params = useSearchParams();
  const idTriage = params.get("Triage");
  const idConsultation = params.get("Consultation");
  const idDiagnosis = params.get("Diagnosis");
  const [patient, setPatient] = useState<any>(null);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (idTriage) {
      DoctorService.getTriageDetails(Number(idTriage))
        .then((res) => {
          const patientData = res.data;
          setPatient(patientData);
        })
        .catch((err) => {
          console.error("Error al cargar paciente:", err);
          setPatient(null);
        });
    }
  }, [idTriage]);
  useEffect(() => {
    const fetchDiagnoses = async () => {
      const response = await DiagnosisService.getAll();
      if (response.success) {
        setDiagnoses(response.data);
      } else {
        setAlertType("error");
        setAlertMessage(response.message || "Error al obtener diagnósticos");
      }
      setLoading(false);
    };
    fetchDiagnoses();
  }, []);
  const handleSaveDiagnosis = async () => {
    if (!selectedDiagnosis) {
      setAlertType("error");
      setAlertMessage("Debe seleccionar un diagnóstico antes de continuar.");
      return;
    }

    if (!idConsultation) {
      setAlertType("error");
      setAlertMessage("No se encontró el ID de la consulta.");
      return;
    }

    try {
      setLoading(true);

      const addDiagnosisResponse = await DiagnosisService.addDiagnosis(
        Number(idConsultation),
        Number(selectedDiagnosis)
      );

      if (addDiagnosisResponse.success) {
        setAlertType("success");
        setAlertMessage(addDiagnosisResponse.message);
        setTimeout(() => {
          router.push(
            `/doctor/treatment?Triage=${idTriage}&Consultation=${idConsultation}&Diagnosis=${selectedDiagnosis}`
          );
        }, 1500);
      } else {
        setAlertType("error");
        setAlertMessage(addDiagnosisResponse.message);
      }
    } catch (error) {
      console.error("Error al registrar diagnóstico:", error);
      setAlertType("error");
      setAlertMessage("Ocurrió un error al registrar el diagnóstico.");
    } finally {
      setLoading(false);
    }
  };

  if (!idTriage) {
    return (
      <div className="text-center text-gray-500">
        No hay paciente seleccionado
      </div>
    );
  }
  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      {/* Card principal del título */}
      <Card>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Registro de Diagnóstico
        </h2>
      </Card>

      <div className="mt-6"></div>

      {/* Card de información del paciente */}
      <Card>
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2 ">
          <Stethoscope className="w-5 h-5 text-gray-600" />
          Registrar Diagnóstico Final - {patient?.patientName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patient ? (
            <>
              <div>
                <h3 className="font-bold mb-3 text-gray-800">
                  Información del Paciente
                </h3>

                <div className="space-y-2">
                  <p>
                    <span className="font-bold text-gray">Nombre:</span>{" "}
                    {patient.patientName}
                  </p>
                  <p>
                    <span className="font-bold text-gray">Cédula:</span>{" "}
                    {patient.patientDocument}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray">Prioridad:</span>
                    {patient.lastPriority ? (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          patient.lastPriority.toLowerCase() === "rojo"
                            ? "bg-red-100 text-red-700"
                            : patient.lastPriority.toLowerCase() === "naranja"
                              ? "bg-orange-100 text-orange-700"
                              : patient.lastPriority.toLowerCase() ===
                                  "amarillo"
                                ? "bg-yellow-100 text-yellow-700"
                                : patient.lastPriority.toLowerCase() === "verde"
                                  ? "bg-green-100 text-green-700"
                                  : patient.lastPriority.toLowerCase() ===
                                      "azul"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {patient.lastPriority}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic text-sm">
                        No definida
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="space-y-2">
                  <p className="font-bold text-gray mt-4">
                    Síntomas reportados:
                  </p>
                  <p className="text-medium whitespace-pre-line">
                    {patient.symptoms}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic p-4">
              Cargando información del paciente...
            </p>
          )}
        </div>
      </Card>

      <div className="mt-6"></div>

      {/* Card de signos vitales */}
      <Card>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <Activity className="w-5 h-5 text-gray-700" />
            Signos Vitales
          </h3>
        </div>

        <div className="p-4">
          {patient ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* FRECUENCIA CARDÍACA */}
              <div className="flex flex-col items-center p-3">
                <Heart className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Frecuencia Cardiaca
                </p>
                <p className="font-bold text-lg text-green-600">
                  {patient.heartRate} bpm
                </p>
              </div>

              {/* PRESIÓN ARTERIAL */}
              <div className="flex flex-col items-center p-3">
                <Activity className="w-8 h-8 text-blue-500 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Presión Arterial</p>
                <p className="font-bold text-lg">{patient.bloodPressure}</p>
              </div>

              {/* TEMPERATURA */}
              <div className="flex flex-col items-center p-3">
                <Thermometer className="w-8 h-8 text-orange-500 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Temperatura</p>
                <p className="font-bold text-lg text-green-600">
                  {patient.temperature} °C
                </p>
              </div>

              {/* SATURACIÓN O2 */}
              <div className="flex flex-col items-center p-3">
                <Droplets className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-600 mb-1">Saturación O2</p>
                <p className="font-bold text-lg text-green-600">
                  {patient.oxygenSaturation}%
                </p>
              </div>

              {/* FRECUENCIA RESPIRATORIA */}
              <div className="flex flex-col items-center p-3">
                <Wind className="w-8 h-8 text-teal-500 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Frecuencia Respiratoria
                </p>
                <p className="font-bold text-lg text-green-600">
                  {patient.respiratoryRate} rpm
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic p-4">
              Cargando signos vitales del paciente...
            </p>
          )}
        </div>
      </Card>

      {/* Card del diagnóstico final */}
      <Card className="mb-20 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Seleccionar Diagnóstico Final
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Diagnóstico:</label>
          <select
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            value={selectedDiagnosis}
            onChange={(e) => setSelectedDiagnosis(e.target.value)}
          >
            <option value="">Seleccione un diagnóstico</option>
            {diagnoses.map((d) => (
              <option key={d.diagnosisId} value={d.diagnosisId}>
                {d.diagnosisName}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      {/* Botones inferiores */}
      <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg flex justify-end gap-3 z-50">
        <Button
          onClick={handleGoBack}
          className="shadow-md bg-gray-500 hover:bg-gray-600 text-white"
        >
          Atrás
        </Button>
        <Button
          onClick={handleSaveDiagnosis}
          disabled={loading}
          className="shadow-md bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {loading ? "Guardando Diagnóstico..." : "Continuar al Tratamiento"}
        </Button>
      </div>
    </>
  );
}
