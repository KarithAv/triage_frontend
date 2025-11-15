"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AuthService from "@/app/services/authService";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
  const data = (await AuthService.login(email, password)) as any;
      //console.log("✅ Respuesta del servidor:", data);

      // Guardar token si viene (algunos backends usan cookies en lugar de token)
      if (data.token) {
        localStorage.setItem("token", data.token);
        Cookies.set("token", data.token);
      }

      // Guardar información del usuario si está presente
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        Cookies.set("user", JSON.stringify(data.user));
      }

      // Determinar rol
      const rol = data.user?.roleName?.toLowerCase() || "";

      if (rol.includes("administrador")) router.push("/administrator");
      else if (rol.includes("medico")) router.push("/doctor")
      else if (rol.includes("enfermero")) router.push("/nurse")
      else router.push("/patient");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-hidden">
      {/* Imagen a la izquierda */}
      <div className="md:w-1/2 w-full bg-[#48B294] flex flex-col justify-center items-center relative">
        <div className="absolute top-[-5rem] left-[-5rem] w-60 h-60 bg-[#3C9C83] rounded-full opacity-60" />
        <div className="absolute bottom-[-5rem] right-[-5rem] w-72 h-72 bg-[#3C9C83] rounded-full opacity-60" />

        <img
          src="/images/illustration.png"
          alt="Ilustración médica"
          className="max-w-md w-[80%] z-10"
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="md:w-1/2 w-full flex justify-center items-center bg-[#EFFFFA] p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gray-100 p-3 rounded-full">
              <FaUser className="text-3xl text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold mt-3 text-center text-gray-800">
              Intelligent TriAge
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Correo electrónico
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#7D4AF9]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingrese su correo"
                  className="flex-1 bg-transparent outline-none text-sm"
                  required
                />
                <FaUser className="text-gray-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Contraseña
              </label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#7D4AF9]">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="flex-1 bg-transparent outline-none text-sm"
                  required
                />
                <FaLock className="text-gray-500" />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
            >
              Iniciar sesión
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              *En el primer inicio de sesión, la contraseña será igual a la
              cédula
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}