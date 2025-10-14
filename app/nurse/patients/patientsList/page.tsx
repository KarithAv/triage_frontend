"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import Table from "@/components/table";
import PatientService from "@/app/services/patientService";

interface Patient {
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
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Listado de Pacientes
      </h2>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      <div className="flex justify-between items-center mb-5">
        <div>
          <label className="mr-2 text-sm font-semibold">Filtrar por:</label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
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

      {loading ? (
        <div className="text-center py-6 text-gray-500">
          Cargando pacientes...
        </div>
      ) : (
        <Table columns={columns} data={tableData} />
      )}
    </div>
  );
}
