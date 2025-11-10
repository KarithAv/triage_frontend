import axios from "axios";

const API_URL = "https://localhost:7233";

export default class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Usuario o contraseña incorrectos.");
        }
        throw new Error(
          error.response.data?.message ||
            "Ocurrió un error en el servidor. Inténtalo nuevamente."
        );
      } else if (error.request) {
        // Error de red o servidor no responde
        throw new Error("No se pudo conectar con el servidor.");
      } else {
        throw new Error("Error desconocido al iniciar sesión.");
      }
    }
  }

  static async logout() {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Sesión cerrada en el servidor");
      } else {
        console.warn("Error al cerrar sesión en el servidor:", response.status);
      }
    } catch (error) {
      console.error("Error de conexión al cerrar sesión:", error);
    }
  }
}
