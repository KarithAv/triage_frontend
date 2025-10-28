"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import Table from "@/components/table";
import { Card } from "@/components/card";
import PatientProfile from "./patientProfile";
import PatientService from "@/app/services/patientService";

interface Patient {
  triageId: number;
  patientId: number;
  identification: string;
  fullName: string;
  gender: string;
  age: number;
  symptoms: string;
  temperature: number;
  heartRate: number;
  bloodPressure: string;
  respiratoryRate: number;
  oxygenSaturation: number;
  priorityName: string;
}

export default function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("Todos");
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPatients();
  }, [selectedColor]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const colorParam = selectedColor !== "Todos" ? selectedColor : "";
      const response = await PatientService.getPatients(colorParam || "");
      setPatients(response.data);
    } catch (error) {
      console.error(error);
      setAlertMessage("Error al cargar la lista de pacientes.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "index", label: "#" },
    { key: "identification", label: "Identificación" },
    { key: "fullName", label: "Nombre Completo" },
    { key: "gender", label: "Sexo" },
    { key: "age", label: "Edad" },
    { key: "symptoms", label: "Síntomas" },
    { key: "signs", label: "Signos Vitales" },
    { key: "priority", label: "Prioridad" },
    { key: "actions", label: "Acciones" },
  ];

  const tableData = patients.map((patient, index) => ({
    index: index + 1,
    identification: patient.identification,
    fullName: patient.fullName,
    gender: patient.gender,
    age: patient.age,
    symptoms: patient.symptoms,
    signs: (
      <div className="whitespace-pre-line">
        <strong>T°:</strong> {patient.temperature}°C
        <br />
        <strong>FC:</strong> {patient.heartRate} bpm
        <br />
        <strong>PA:</strong> {patient.bloodPressure} mmHg
        <br />
        <strong>FR:</strong> {patient.respiratoryRate} rpm
        <br />
        <strong>SpO₂:</strong> {patient.oxygenSaturation}%
      </div>
    ),
    priority: (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          patient.priorityName === "Rojo"
            ? "bg-red-100 text-red-700"
            : patient.priorityName === "Naranja"
              ? "bg-orange-100 text-orange-700"
              : patient.priorityName === "Amarillo"
                ? "bg-yellow-100 text-yellow-700"
                : patient.priorityName === "Verde"
                  ? "bg-green-100 text-green-700"
                  : patient.priorityName === "Azul"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
        }`}
      >
        {patient.priorityName}
      </span>
    ),
    actions: (
      <Button
        className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded"
        onClick={async () => {
          try {
            const response = await PatientService.getTriagePatient(
              patient.triageId
            );

            if (response.success && response.data.length > 0) {
              const patientId = {
                ...response.data[0],
                triageId: patient.triageId,
              };
              setSelectedPatient(patientId);
              setShowModal(true);
            } else {
              setAlertMessage(response.message);
            }
          } catch (error) {
            console.error("Error al obtener paciente:", error);
            setAlertMessage(
              "Ocurrió un error al cargar la información del paciente."
            );
          } finally {
            setLoading(false);
          }
        }}
      >
        Ver más
      </Button>
    ),
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800">
        Listado de Pacientes
      </h2>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      <Card className="overflow-hidden p-5">
        {/* 🔹 Filtros y opciones */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-semibold whitespace-nowrap">
              Filtrar por:
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto focus:ring-2 focus:ring-purple-400 outline-none"
            >
              <option value="Todos">Todos</option>
              <option value="Rojo">Rojo</option>
              <option value="Naranja">Naranja</option>
              <option value="Amarillo">Amarillo</option>
              <option value="Verde">Verde</option>
              <option value="Azul">Azul</option>
            </select>
          </div>
        </div>

        {/* 🔹 Contenido principal: Tabla o carga */}
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            Cargando pacientes...
          </div>
        ) : (
          <Table columns={columns} data={tableData} />
        )}
      </Card>

      {showModal && (
        <PatientProfile
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onRefresh={loadPatients}
          patient={selectedPatient}
        />
      )}
    </div>
  );
}
