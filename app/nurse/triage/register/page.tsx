"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import PatientService from "@/app/services/patientService";

export default function SignosVitalesPanel() {
  const [document, setDocument] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [id, setId] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [presion, setPresion] = useState("");
  const [frecuenciaCardiaca, setFrecuenciaCardiaca] = useState("");
  const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [saturacion, setSaturacion] = useState("");
  const [patient, setPatient] = useState<any>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [alertMessage, setAlertMessage] = useState("");

  const handleSearch = async () => {
    setAlertType("info");
    setAlertMessage("");
    setPatient(null);

    const result = await PatientService.getPatientByDocument(document);

    if (result.success === false) {
      setAlertType("error");
      setAlertMessage(result.message); // Muestra el mensaje del backend si no se encontró
    } else {
      setPatient(result.data);
      setNombre(result.data.nombre);
      setApellido(result.data.apellido);
      setId(result.data.id);
    }
  };

  const handleCancelar = () => {
    setDocument("");
    setNombre("");
    setId("");
    setSintomas("");
    setPresion("");
    setFrecuenciaRespiratoria("");
    setFrecuenciaCardiaca("");
    setTemperatura("");
    setSaturacion("");
  };

  const handleSiguiente = () => {
    console.log({
      document,
      nombre,
      id,
      sintomas,
      presion,
      frecuenciaCardiaca,
      frecuenciaRespiratoria,
      temperatura,
      saturacion,
    });
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-[url('/images/fondo.png')] bg-repeat p-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[700px]">
        <h2 className="text-3xl font-extrabold text-center mb-6">
          Registro de Signos Vitales
        </h2>

        {/* Buscar paciente */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Buscar Paciente por Cédula
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              placeholder="Ingrese cédula"
              className="border rounded-lg p-2 w-full"
            />
            <Button
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded"
            >
              Consultar
            </Button>
            <Alert
              message={alertMessage}
              type={alertType}
              onClose={() => setAlertMessage("")}
            />
          </div>

          {nombre && (
            <div className="bg-purple-100 text-sm rounded-lg p-2 mt-3 text-gray-700">
              <p>
                <strong>Nombre:</strong> {nombre} {apellido}
              </p>
            </div>
          )}
        </div>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">
          Registrar Síntomas y Signos Vitales de{" "}
          {nombre || apellido ? `${nombre} ${apellido}` : " "}
        </h3>

        {/* Síntomas */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Síntomas</label>
          <textarea
            value={sintomas}
            onChange={(e) => setSintomas(e.target.value)}
            placeholder="Describa los síntomas principales (ej: dolor abdominal, mareo...)"
            className="border rounded-lg w-full p-3 resize-none"
            rows={3}
          ></textarea>
        </div>

        {/* Signos vitales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-1">
              Presión Arterial (ej: 120/80)
            </label>
            <input
              type="text"
              value={presion}
              onChange={(e) => setPresion(e.target.value)}
              placeholder="120/80"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Frecuencia Cardíaca (lpm)
            </label>
            <input
              type="number"
              value={frecuenciaCardiaca}
              onChange={(e) => setFrecuenciaCardiaca(e.target.value)}
              placeholder="80"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Frecuencia Respiratoria (rpm)
            </label>
            <input
              type="number"
              value={frecuenciaRespiratoria}
              onChange={(e) => setFrecuenciaRespiratoria(e.target.value)}
              placeholder="16"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Temperatura (°C)</label>
            <input
              type="number"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              placeholder="37.0"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Saturación de Oxígeno (%)
            </label>
            <input
              type="number"
              value={saturacion}
              onChange={(e) => setSaturacion(e.target.value)}
              placeholder="95"
              className="border rounded-lg p-2 w-full"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleCancelar}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSiguiente}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </main>
  );
}
