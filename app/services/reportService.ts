import api from "./api";
import { getUser } from "@/app/utilities/session";

export default class ReportService {

  static async generarReporte(startDate: string, endDate: string) {
    try {
      const user = getUser();

      if (!user || !user.firstNameUs) {
        console.error("⚠️ No se encontró información del usuario en la sesión.");
        throw new Error("No se encontró información del usuario en la sesión.");
      }

      const userName = user.firstNameUs;

      const response = await api.get("/Report/triageReport", {
        params: { userName, startDate, endDate },
        responseType: "blob",     
        headers: {
          Accept: "*/*",
        }
      });

      // Crear URL temporal para descargar el archivo PDF
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Reporte_Triage_${startDate}_a_${endDate}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      return {
        success: true,
        message: "Reporte descargado correctamente"
      };

    } catch (error: any) {
      console.error("❌ Error en ReportService:", error);
      return {
        success: false,
        message: "Error al generar el reporte"
      };
    }
  }
}
