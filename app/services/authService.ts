import axios from "axios";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:7233/api";

const api = axios.create({
  baseURL: API_URL, 
  withCredentials: true, // 
  headers: {
    "Content-Type": "application/json",
  },
});

export default class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await api.post("/Autentication/login", {
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
      await api.post("/Autentication/logout", {});
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
}
