"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import Table from "@/components/table";
import { Card } from "@/components/card";
import AlertService from "@/app/services/alertService";

interface NurseAlert {
  idAlert: number;
  idPatient: number;
  patientName: string;
  priorityName: string;
  priorityColor: string;
  alertDate: string;
  statusName: string;
  symptoms: string;
  triageDate: string;
}

export default function NurseAlerts() {
  const [alerts, setAlerts] = useState<NurseAlert[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await AlertService.getAllAlerts();
      // solo las activas
      const activeAlerts = Array.isArray(response)
        ? response.filter((a) => a.statusName === "Activo")
        : [];
      setAlerts(activeAlerts);
    } catch (error) {
      console.error(error);
      setAlertMessage("Error al cargar la lista de alertas.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsAttended = async (idAlert: number) => {
    try {
      const response = await AlertService.updateAlertStatus(idAlert, 2); // 2 = Finalizado
      setAlertMessage(response.message || "Alerta marcada como atendida.");
      setAlertType("success");

      setAlerts((prev) => prev.filter((a) => a.idAlert !== idAlert));
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setAlertMessage("No se pudo marcar la alerta como atendida.");
      setAlertType("error");
    }
  };

  const columns = [
    { key: "index", label: "#" },
    { key: "patientName", label: "Paciente" },
    { key: "priority", label: "Prioridad" },
    { key: "symptoms", label: "Síntomas" },
    { key: "alertDate", label: "Fecha de Alerta" },
    { key: "status", label: "Estado" },
    { key: "actions", label: "Acciones" },
  ];

  const tableData = alerts.map((alert, index) => ({
    index: index + 1,
    patientName: alert.patientName,
    priority: (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          alert.priorityName === "Rojo"
            ? "bg-red-100 text-red-700"
            : alert.priorityName === "Naranja"
              ? "bg-orange-100 text-orange-700"
              : alert.priorityName === "Amarillo"
                ? "bg-yellow-100 text-yellow-700"
                : alert.priorityName === "Verde"
                  ? "bg-green-100 text-green-700"
                  : alert.priorityName === "Azul"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
        }`}
      >
        {alert.priorityName}
      </span>
    ),
    symptoms: alert.symptoms,
    alertDate: new Date(alert.alertDate).toLocaleString(),
    status: (
      <span
        className={`font-medium ${
          alert.statusName === "Activo"
            ? "text-green-600"
            : "text-gray-500"
        }`}
      >
        {alert.statusName}
      </span>
    ),
    actions: (
      <Button
        className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
        onClick={() => handleMarkAsAttended(alert.idAlert)}
      >
        Marcar atendida
      </Button>
    ),
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
        Lista de Alertas
      </h2>

      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />

      <Card className="overflow-hidden p-5">
        {loading ? (
          <div className="text-center py-6 text-gray-500">
            Cargando alertas...
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No hay alertas activas.
          </div>
        ) : (
          <Table columns={columns} data={tableData} />
        )}
      </Card>
    </div>
  );
}
