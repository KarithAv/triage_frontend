"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import PatientService from "@/app/services/patientService";
import TriageService from "@/app/services/triageService";

export default function SignosVitalesPanel() {
  const [document, setDocument] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [id, setId] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [temperature, setTemperature] = useState("");
  const [oxygenSaturation, setOxygenSaturation] = useState("");
  const [patient, setPatient] = useState<any>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [alertMessage, setAlertMessage] = useState("");

  const router = useRouter();

  const handleSearch = async () => {
    setAlertType("info");
    setAlertMessage("");
    setPatient(null);

    const result = await PatientService.getPatientByDocument(document);

    if (result.success) {
      setPatient(result.data);
      setFirstName(result.data.nombre);
      setLastName(result.data.apellido);
      setId(result.data.id);
      setAge(result.data.edad);
    } else {
      setAlertType("error");
      setAlertMessage(result.message);
    }
  };

  const handleCancelar = () => {
    setDocument("");
    setFirstName("");
    setId("");
    setAge("");
    setSymptoms("");
    setBloodPressure("");
    setRespiratoryRate("");
    setHeartRate("");
    setTemperature("");
    setOxygenSaturation("");
  };

  const handleSiguiente = async () => {
    setAlertType("info");
    setAlertMessage("");

    if (!id) {
      setAlertType("error");
      setAlertMessage("Primero debe consultar un paciente válido");
      return;
    }

    if (
      !symptoms.trim() ||
      !bloodPressure.trim() ||
      !heartRate ||
      !respiratoryRate ||
      !temperature ||
      !oxygenSaturation
    ) {
      setAlertType("error");
      setAlertMessage(
        "Por favor, complete todos los campos antes de continuar."
      );
      return;
    }

    try {
      const data = {
        vitalSigns: {
          heartRate: Number(heartRate),
          respiratoryRate: Number(respiratoryRate),
          bloodPressure: bloodPressure,
          temperature: Number(temperature),
          oxygenSaturation: Number(oxygenSaturation),
        },
        symptoms,
        idPatient: Number(id),
        patientAge: Number(age),
      };

      const response = await TriageService.registerTriage(data);

      if (response.success === true) {
        setAlertType("success");
        setAlertMessage(response.message);
        setTimeout(() => {
          router.push(`/nurse/triage/suggestion?idTriage=${response.idTriage}`);
        }, 1200);
      } else {
        setAlertType("error");
        setAlertMessage(response.message || "Error al registrar los datos");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-[url('/images/fondo.png')] bg-repeat p-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[700px]">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Registro de Signos Vitales
        </h2>

        {/* Buscar paciente */}
        <div className="mb-4">
          <label htmlFor="buscarDocumento" className="block font-semibold mb-2">
            Buscar Paciente por Cédula
          </label>
          <div className="flex gap-3">
            <input
              id="buscarDocumento"
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

          {firstName && (
            <div className="bg-purple-100 text-sm rounded-lg p-2 mt-3 text-gray-700">
              <p>
                <strong>Nombre:</strong> {firstName} {lastName}
              </p>
            </div>
          )}
          {age && (
            <div className="bg-purple-100 text-sm rounded-lg p-2 mt-3 text-gray-700">
              <p>
                <strong>Edad:</strong> {age}
              </p>
            </div>
          )}
        </div>

        <hr className="my-4" />

        <h3 className="font-semibold mb-2">
          Registrar Síntomas y Signos Vitales de{" "}
          {firstName || lastName ? `${firstName} ${lastName}` : " "}
        </h3>

        {/* Síntomas */}
        <div className="mb-4">
          <label htmlFor="symptomsInput" className="block font-semibold mb-2">
            Síntomas
          </label>
          <textarea
            id="symptomsInput"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describa los síntomas principales..."
            className="border rounded-lg w-full p-3 resize-none"
            rows={3}
          ></textarea>
        </div>

        {/* Signos vitales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="bloodPressureInput"
              className="block font-semibold mb-1"
            >
              Presión Arterial (ej: 120/80)
            </label>
            <input
              id="bloodPressureInput"
              type="text"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              placeholder="120/80"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="heartRateInput"
              className="block font-semibold mb-1"
            >
              Frecuencia Cardíaca (lpm)
            </label>
            <input
              id="heartRateInput"
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
              placeholder="80"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="respRateInput" className="block font-semibold mb-1">
              Frecuencia Respiratoria (rpm)
            </label>
            <input
              id="respRateInput"
              type="number"
              value={respiratoryRate}
              onChange={(e) => setRespiratoryRate(e.target.value)}
              placeholder="16"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label
              htmlFor="temperatureInput"
              className="block font-semibold mb-1"
            >
              Temperatura (°C)
            </label>
            <input
              id="temperatureInput"
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="37.0"
              className="border rounded-lg p-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="oxygenInput" className="block font-semibold mb-1">
              Saturación de Oxígeno (%)
            </label>
            <input
              id="oxygenInput"
              type="number"
              value={oxygenSaturation}
              onChange={(e) => setOxygenSaturation(e.target.value)}
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
