"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function NotAuthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-200 px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg text-center border border-purple-200"
      >
        
        {/* Ícono animado */}
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-center mb-6"
        >
          <ShieldAlert className="w-20 h-20 text-red-500 drop-shadow-lg" />
        </motion.div>

        {/* Título */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
          Acceso No Autorizado
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          No tienes permisos para ingresar a esta sección de <strong>Intelligent TriAge</strong>.  
          Por favor verifica tu rol o vuelve al inicio.
        </p>

        {/* Botón */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
        >
          <ArrowLeft size={20} />
          Volver al inicio
        </Link>

      </motion.div>
    </div>
  );
}
