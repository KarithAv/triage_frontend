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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorService from "@/app/services/doctorService";
import Alert from "@/components/alert";
import Table from "@/components/table";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import Badge from "@/components/badge";

export default function ClinicHistoryPage() {
  const params = useSearchParams();
  const idTriage = params.get("Triage");
  const idConsultation = params.get("Consultation");
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [columns] = useState([
    { key: "startTime", label: "Hora Inicio" },
    { key: "diagnosisName", label: "Diagnóstico" },
    { key: "diagnosisObservation", label: "Observación" },
    { key: "treatmentDescription", label: "Tratamiento" },
  ]);

  useEffect(() => {
    if (!idTriage) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const triageRes = await DoctorService.getTriageDetails(
          Number(idTriage)
        );
        const patientData = triageRes.data;
        setPatient(patientData);

        if (patientData?.patientId) {
          const historyRes = await DoctorService.getConsultationHistory(
            patientData.patientId
          );

          const data = historyRes.data || [];
          setHistory(data);

          setTableData(
            data.map((item: any) => {
              const horaInicio =
                item.startTime ||
                item.consultationStartTime ||
                item.start_date ||
                item.fechaInicio ||
                "—";
              let tratamiento = item.treatmentDescription || "—";
              if (item.medicationName) {
                tratamiento += `\n\n💊 Medicamento: ${item.medicationName}`;
              }

              if (item.examName) {
                tratamiento += `\n🧪 Examen sugerido: ${item.examName}`;
              }

              return {
                startTime: horaInicio,
                diagnosisName: item.diagnosisName || "—",
                diagnosisObservation: item.diagnosisObservation || "—",
                treatmentDescription: tratamiento.trim() || "—",
              };
            })
          );
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setPatient(null);
        setHistory([]);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idTriage]);

  if (!idTriage) {
    return (
      <div className="text-center text-gray-500">
        No hay paciente seleccionado
      </div>
    );
  }
  const handleContinuar = () => {
    router.push(
      `/doctor/diagnosis?Triage=${idTriage}&Consultation=${idConsultation}`
    );
  };

  return (
    <>
      <Card>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Historia Clínica
        </h2>
      </Card>

      <div className="mt-6"></div>

      <Card>
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2 ">
          <FileText className="w-5 h-5 text-gray-600" />
          Historia Clínica - {patient?.patientName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patient ? (
            <>
              <div>
                <h3 className="font-bold mb-3 text-gray-800">
                  Información del Paciente
                </h3>

                <div className="space-y-2">
                  {" "}
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
                  {patient.assignedDoctor && (
                    <>
                      <p>
                        <span className="font-bold text-gray">
                          Enfermero asignado:
                        </span>{" "}
                        {patient.assignedDoctor}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-3 text-gray-800">Triage Actual</h3>

                <div className="space-y-2">
                  {" "}
                  <p>
                    <span className="font-bold text-gray">Hora de triage:</span>{" "}
                    {patient.triageTime}
                  </p>
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
      <Card>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <Activity className="w-5 h-5 text-gray-700" />
            Signos Vitales
          </h3>
        </div>

        <div className="p-4">
          {patient ? (
            // Cuadrícula para los 5 signos vitales
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/*FRECUENCIA CARDÍACA */}
              <div className="flex flex-col items-center p-3">
                <Heart className="w-8 h-8 text-red-500 mb-2" />{" "}
                <p className="text-sm text-gray-600 mb-1">
                  Frecuencia Cardiaca
                </p>
                <p className="font-bold text-lg text-green-600">
                  {patient.heartRate} bpm
                </p>
              </div>

              {/* PRESIÓN ARTERIAL */}
              <div className="flex flex-col items-center p-3">
                <Activity className="w-8 h-8 text-blue-500 mb-2" />{" "}
                <p className="text-sm text-gray-600 mb-1">Presión Arterial</p>
                <p className="font-bold text-lg">{patient.bloodPressure}</p>
              </div>

              {/* TEMPERATURA */}
              <div className="flex flex-col items-center p-3">
                <Thermometer className="w-8 h-8 text-orange-500 mb-2" />{" "}
                <p className="text-sm text-gray-600 mb-1">Temperatura</p>
                <p className="font-bold text-lg text-green-600">
                  {patient.temperature} °C
                </p>
              </div>

              {/* SATURACIÓN O2 */}
              <div className="flex flex-col items-center p-3">
                <Droplets className="w-8 h-8 text-green-500 mb-2" />{" "}
                <p className="text-sm text-gray-600 mb-1">Saturación O2</p>
                <p className="font-bold text-lg text-green-600">
                  {patient.oxygenSaturation}%
                </p>
              </div>

              {/*FRECUENCIA RESPIRATORIA */}
              <div className="flex flex-col items-center p-3">
                <Wind className="w-8 h-8 text-teal-500 mb-2" />{" "}
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
      <div className="mt-6"></div>
      <Card>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 text-gray-700" />
            Historial de Consultas Previas
          </h3>
          {loading ? (
            <p className="text-gray-500 italic p-4">
              Cargando historial del paciente...
            </p>
          ) : tableData.length > 0 ? (
            <Table columns={columns} data={tableData} />
          ) : (
            <p className="text-gray-500 italic p-4">
              Sin consultas previas registradas.
            </p>
          )}
        </div>
      </Card>
      <div className="fixed bottom-6 right-6 flex gap-3 z-50">
        <Button
          variant="primary"
          onClick={handleContinuar}
          className="shadow-md"
        >
          Continuar al diagnóstico
        </Button>
      </div>
    </>
  );
}
