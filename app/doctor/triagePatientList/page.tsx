"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import Table from "@/components/table";
import { Card } from "@/components/card";
import DoctorService from "@/app/services/doctorService";
import { getUserId } from "@/app/utilities/session";

interface Patient {
  triageId: number;
  fullName: string;
  identification: string;
  symptoms: string;
  priorityLevel: string;
  color: string;
  arrivalHour: string;
  medicName: string;
}

export default function MedicoPacientesList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadPatients = async (fullName = "", identification = "") => {
    try {
      setLoading(true);
      const response = await DoctorService.getAllFiltered(
        fullName,
        identification
      );

      if (response.success && response.data && response.data.length > 0) {
        setPatients(response.data);
        setFilteredPatients(response.data);
      } else {
        setPatients([]);
        setFilteredPatients([]);
        setAlertMessage(
          "No hay pacientes registrados actualmente con esos datos."
        );
        setAlertType("info");
      }
    } catch (error) {
      console.error(error);
      setAlertMessage("Error al cargar la lista de pacientes.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (term === "") {
      loadPatients(); // carga todos los pacientes
      return;
    }

    const isNumber = /^[0-9]+$/.test(term);

    if (isNumber) {
      loadPatients("", term); // busca por cédula
    } else {
      loadPatients(term, ""); // busca por nombre
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSeleccionar = async (triageId: number) => {
    try {
      const idMedic = getUserId();

      if (!idMedic) {
        setAlertType("error");
        setAlertMessage("No se encontró el ID del médico en la sesión.");
        return;
      }
      const result = await DoctorService.startConsultation(idMedic, triageId);

      if (result.success === true) {
        setAlertType("success");
        setAlertMessage(result.message);
        setTimeout(() => {
          router.push(`/doctor/clinicHistory?Triage=${triageId}`);
        }, 1200);
      } else {
        setAlertType("error");
        setAlertMessage(`${result.message || "Error al registrar los datos"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error al iniciar la consulta.");
    }
  };

  const columns = [
    { key: "index", label: "#" },
    { key: "identification", label: "Identificación" },
    { key: "fullName", label: "Nombre Completo" },
    { key: "symptoms", label: "Síntomas" },
    { key: "priorityLevel", label: "Prioridad" },
    { key: "arrivalHour", label: "Hora de Llegada" },
    { key: "medicName", label: "Médico Asignado" },
    { key: "actions", label: "Acción" },
  ];

  const tableData = filteredPatients.map((patient, index) => {
    const isAssigned =
    patient.medicName &&
    patient.medicName.trim() !== "" &&
    patient.medicName.trim().toLowerCase() !== "sin asignar";

    return {
      index: index + 1,
      identification: patient.identification,
      fullName: patient.fullName,
      symptoms: patient.symptoms,
      priorityLevel: (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            patient.priorityLevel === "Rojo"
              ? "bg-red-100 text-red-700"
              : patient.priorityLevel === "Naranja"
                ? "bg-orange-100 text-orange-700"
                : patient.priorityLevel === "Amarillo"
                  ? "bg-yellow-100 text-yellow-700"
                  : patient.priorityLevel === "Verde"
                    ? "bg-green-100 text-green-700"
                    : patient.priorityLevel === "Azul"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
          }`}
        >
          {patient.priorityLevel}
        </span>
      ),
      arrivalHour: patient.arrivalHour,
      medicName: patient.medicName || "—",
      actions: (
        <Button
          className={`text-sm px-3 py-1 rounded ${
            isAssigned
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={isAssigned}
          onClick={() => !isAssigned && handleSeleccionar(patient.triageId)}
        >
          {isAssigned ? "Asignado" : "Seleccionar"}
        </Button>
      ),
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800">
        Pacientes en Triage
      </h2>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />
      <Card className="overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex w-full sm:w-auto flex-grow gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre o cédula..."
              className="font-light w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table columns={columns} data={tableData} />
      </Card>
    </div>
  );
}
