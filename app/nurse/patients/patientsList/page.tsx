"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Lista de Pacientes</h2>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("info")}
      />

      {/* Filtro por color */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 text-sm font-semibold">
            Filtrar por color:
          </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="border border-gray-200 px-4 py-2">#</th>
              <th className="border border-gray-200 px-4 py-2">
                Identificación
              </th>
              <th className="border border-gray-200 px-4 py-2">
                Nombre Completo
              </th>
              <th className="border border-gray-200 px-4 py-2">Sexo</th>
              <th className="border border-gray-200 px-4 py-2">Edad</th>
              <th className="border border-gray-200 px-4 py-2">Síntomas</th>
              <th className="border border-gray-200 px-4 py-2">
                Signos Vitales
              </th>
              <th className="border border-gray-200 px-4 py-2">Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Cargando pacientes...
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient, index) => (
                <tr
                  key={`${patient.patientId}-${index}`}
                  className="hover:bg-gray-50 text-sm"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{patient.identification}</td>
                  <td className="border px-4 py-2">{patient.fullName}</td>
                  <td className="border px-4 py-2">{patient.gender}</td>
                  <td className="border px-4 py-2">{patient.age}</td>
                  <td className="border px-4 py-2">{patient.symptoms}</td>
                  <td className="border px-4 py-2 whitespace-pre-line">
                    <div>
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
                  </td>
                  <td
                    className={`border px-4 py-2 font-semibold text-center ${
                      patient.priorityName === "Rojo"
                        ? "text-red-600"
                        : patient.priorityName === "Naranja"
                          ? "text-orange-600"
                          : patient.priorityName === "Amarillo"
                            ? "text-yellow-500"
                            : patient.priorityName === "Verde"
                              ? "text-green-600"
                              : patient.priorityName === "Azul"
                                ? "text-blue-600"
                                : "text-gray-600"
                    }`}
                  >
                    {patient.priorityName}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-4 text-gray-500 italic"
                >
                  No hay pacientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
