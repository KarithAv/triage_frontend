"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Alert({
  message,
  type = "info",
  onClose,
  duration = 3000,
}: AlertProps) {
  // Cerrar automáticamente después de X tiempo
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const colors = {
    success: "purple-bg text-white",
    error: "purple-bg text-white",
    info: "purple-bg text-white",
  };

  return (
    <div
      className={`fixed top-5 right-5 flex items-center justify-between w-96 px-4 py-4 rounded-lg shadow-lg ${colors[type]} animate-fade-in`}
    >
      <span className="text-base font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200"
      >
        <X size={20} />
      </button>
    </div>
  );
}
