"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import Alert from "@/components/alert";
import UserService from "@/app/services/userService";

interface ChangeStatusUserProps {
  userId: number;
  stateId: number; // 1 = activo, 0 = inactivo
  onStatusChanged: () => void;
}

export default function ChangeStatusUser({
  userId,
  stateId,
  onStatusChanged,
}: ChangeStatusUserProps) {
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");

  const handleToggleStatus = async () => {
    const newState = stateId === 1 ? 0 : 1; // cambiar estado
    const actionText = stateId === 1 ? "deshabilitar" : "habilitar";

    if (!confirm(`¿Estás seguro de que deseas ${actionText} este usuario?`)) return;

    setLoading(true);
    try {
      const res = await UserService.changeUserStatus(userId, newState);

      setAlertType("success");
      setAlertMessage(res.message || `Usuario ${actionText} correctamente`);
      onStatusChanged();
    } catch (err) {
      console.error("Error cambiando estado:", err);
      setAlertType("error");
      setAlertMessage("⚠️ Error de conexión con el servidor");
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(""), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")}
        />
      )}

      <Button
        onClick={handleToggleStatus}
        disabled={loading}
        className={`px-3 py-1 rounded text-white text-sm ${stateId === 1
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
          }`}
      >
        {loading
          ? "Procesando..."
          : stateId === 1
            ? "Deshabilitar"
            : "Habilitar"}
      </Button>

    </div>
  );
}  