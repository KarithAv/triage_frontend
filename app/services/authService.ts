import axios from "axios";

const API_URL = "https://localhost:7233/api";

export default class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await axios.post(
        `${API_URL}/Autentication/login`,
        { email, password },
        {
          withCredentials: true, // ⬅ NECESARIO PARA RECIBIR HttpOnly cookies
        }
      );

      return response.data; // Solo contiene { id, firstNameUs, lastNameUs, roleIdUs }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Usuario o contraseña incorrectos.");
        }
        throw new Error(
          error.response.data?.message ??
            "Ocurrió un error en el servidor. Inténtalo nuevamente."
        );
      }

      if (error.request) {
        throw new Error("No se pudo conectar con el servidor.");
      }

      throw new Error("Error desconocido al iniciar sesión.");
    }
  }

  static async logout() {
    try {
      await axios.post(
        `${API_URL}/Autentication/logout`,
        {},
        {
          withCredentials: true, // Para que backend borre la cookie HttpOnly
        }
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
}
