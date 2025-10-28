"use client";
import { useSearchParams } from "next/navigation";
import { FileText, Stethoscope, Zap, Pill, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import TreatmentService from "@/app/services/treatmentService";
import DoctorService from "@/app/services/doctorService";
import Alert from "@/components/alert";
import Table from "@/components/table";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import DiagnosisService from "@/app/services/diagnosisService";

interface Exam {
  id: number;
  name: string;
  selected: boolean;
}

interface Medication {
  idMedication: number;
  name: string;
  selected: boolean;
}

export default function TreatmentPage() {
  const params = useSearchParams();
  const idTriage = params.get("Triage");
  const idDiagnosis = params.get("Diagnosis") || "";
  const [patient, setPatient] = useState<any>(null);
  const [diagnosisName, setDiagnosisName] = useState<string>("");
  const [diagnosisNotes, setDiagnosisNotes] = useState<string>("");
  const [exams, setExams] = useState<Exam[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [treatmentDescription, setTreatmentDescription] = useState<string>("");
  const [availableMeds, setAvailableMeds] = useState<any[]>([]);
  const [availableExams, setAvailableExams] = useState<any[]>([]); // exámenes desde API
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
    const fetchDiagnosis = async () => {
      if (!idDiagnosis) return;

      const response = await DiagnosisService.getById(Number(idDiagnosis));
      if (response.success && response.data) {
        setDiagnosisName(response.data.diagnosisName);
        setDiagnosisNotes(response.data.diagnosisNotes);
      }
    };

    fetchDiagnosis();
  }, [idDiagnosis]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, medsRes] = await Promise.all([
          TreatmentService.getAllExams(),
          TreatmentService.getAllMedication(),
        ]);
        if (examsRes.success) {
          setExams(
            (examsRes.data || []).map((e: any) => ({
              id: e.idExam,
              name: e.name,
              selected: false,
            }))
          );
        }

        if (medsRes.success) {
          setMedications(
            (medsRes.data || []).map((m: any) => ({
              idMedication: m.idMedication,
              name: m.name,
              selected: false,
            }))
          );
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        setAlertType("error");
        setAlertMessage("Error al cargar los datos del tratamiento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleExam = (id: number) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === id ? { ...exam, selected: !exam.selected } : exam
      )
    );
  };

  const handleToggleMedication = (idMedication: number) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.idMedication === idMedication
          ? { ...med, selected: !med.selected }
          : med
      )
    );
  };
  const handleFinalizeConsultation = async () => {
    try {
      setLoading(true);

      // Obtener el historial del paciente
      const historyResponse = await DiagnosisService.getByDocument(
        patient.patientDocument
      );

      if (!historyResponse.success || !historyResponse.data?.historyId) {
        setAlertType("error");
        setAlertMessage("No se pudo obtener el historial del paciente.");
        setLoading(false);
        return;
      }

      const historyId = historyResponse.data.historyId;
      const selectedExams = exams.filter((e) => e.selected).map((e) => e.id);
      const selectedMeds = medications
        .filter((m) => m.selected)
        .map((m) => m.idMedication);

      // Crear el payload para la API
      const payload = {
        idHistory: historyId,
        description: treatmentDescription.trim() || "Sin descripción",
        medicationIds: selectedMeds.length ? selectedMeds : [],
        examIds: selectedExams.length ? selectedExams : [],
      };

      // Registrar el tratamiento
      const response = await TreatmentService.registerTreatment(payload);

      if (response.success) {
        setAlertType("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          router.push(`/doctor/triagePatientList`);
        }, 1500);
      } else {
        setAlertType("error");
        setAlertMessage(response.message || "Error al registrar tratamiento.");
      }
    } catch (error) {
      console.error("Error al finalizar consulta:", error);
      setAlertType("error");
      setAlertMessage("Error al finalizar la consulta.");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  if (!idTriage) {
    return (
      <div className="text-center text-gray-500">
        No hay paciente seleccionado
      </div>
    );
  }

  return (
    <>
      <Card>
        <h2 className="text-3xl font-extrabold text-gray-800">
          Registro de Tratamiento
        </h2>
      </Card>

      <div className="mt-6"></div>

      {/* Card de información del paciente */}
      <Card>
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2 ">
          <Stethoscope className="w-5 h-5 text-gray-600" />
          Registrar Tratamiento - {patient?.patientName}
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
                    Diagnostico confirmado:
                  </p>
                  <div className="text-medium whitespace-pre-line">
                    <p>
                      <strong>Nombre:</strong> {diagnosisName}
                    </p>
                    <p>
                      <strong>Notas:</strong> {diagnosisNotes}
                    </p>
                  </div>
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

      {/* Examenes */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Exámenes Sugeridos
          </h2>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exams.map((exam) => (
              <label
                key={exam.id}
                className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-purple-50 transition"
              >
                <input
                  type="checkbox"
                  checked={exam.selected}
                  onChange={() => handleToggleExam(exam.id)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded-md border-purple-300 focus:ring-purple-500"
                />
                <span className="text-gray-700">{exam.name}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-6" />

      {/* Medicamentos */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Pill className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-800">Medicamentos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {medications.map((med) => (
            <label
              key={med.idMedication}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              <input
                type="checkbox"
                checked={med.selected}
                onChange={() => handleToggleMedication(med.idMedication)}
                className="form-checkbox h-5 w-5 text-purple-600 rounded-md border-gray-300 focus:ring-purple-500"
              />
              <span className="text-gray-700">{med.name}</span>
            </label>
          ))}
        </div>
      </Card>

      <div className="mt-6" />

      {/* Descripción*/}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Descripción del Tratamiento
          </h2>
        </div>

        <textarea
          value={treatmentDescription}
          onChange={(e) => setTreatmentDescription(e.target.value)}
          placeholder="Escribe aquí una descripción general del tratamiento o recomendaciones médicas..."
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
        />
      </Card>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      {/* Botones inferiores */}
      <div className="fixed bottom-0 left-0 right-0 p-4 shadow-lg flex justify-end gap-3 z-50">
        <Button
          onClick={handleFinalizeConsultation}
          disabled={loading}
          className="shadow-md bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          {loading ? "Guardando Consulta" : "Finalizar Consulta"}
        </Button>
      </div>
    </>
  );
}
