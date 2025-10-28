import axios from "axios";
import { getUser } from "@/app/utilities/session";

const API_URL = "https://localhost:7233/api/Report";


export default class ReportService {

  static async generarReporte(startDate: string, endDate: string) {
        try {
      // Obtener el usuario desde localStorage
      const user = getUser();

      if (!user || !user.firstNameUs) {
        console.error("⚠️ No se encontró información del usuario en la sesión.");
        throw new Error("No se encontró información del usuario en la sesión.");
      }

      const userName = user.firstNameUs; 

      const response = await axios.get(`${API_URL}/triageReport`, {
        params: { userName, startDate, endDate },
        responseType: "blob", // importante para recibir archivos binarios (PDF/Excel)
        headers: { Accept: "*/*" },
      });

      // Crear URL temporal para descargar el archivo
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reporte_Triage_${startDate}_a_${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true, message: "Reporte descargado correctamente" };
    } catch (error) {
      console.error("❌ Error en ReportService:", error);
      return { success: false, message: "Error al generar el reporte" };
    }
  }
}
