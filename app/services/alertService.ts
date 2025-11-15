import api from "./api";

const API_URL = "/Alert";

export default class AlertService {

  // ================================
  // Obtener todas las alertas (ENFERMERO)
  // ================================
  static async getAllAlerts() {
    try {
      const { data } = await api.get(`${API_URL}/all`);
      return data;
    } catch (error: any) {
      console.error("❌ Error al obtener alertas:", error);
      throw error.response?.data || error.message;
    }
  }

  // ================================
  // Actualizar estado de alerta (ENFERMERO)
  // ================================
  static async updateAlertStatus(idAlert: number, idStatus: number) {
    try {
      const { data } = await api.put(
        `${API_URL}/${idAlert}/status/${idStatus}`
      );
      return data;
    } catch (error: any) {
      console.error("❌ Error al actualizar alerta:", error);
      throw error.response?.data || error.message;
    }
  }

  // ================================
  // Notificar deterioro (PACIENTE)
  // ================================
  static async notifyDeterioration(idPatient: number) {
    try {
      const payload = { idPatient };

      const { data } = await api.post(
        `${API_URL}/notify-deterioration`,
        payload
      );

      return data;
    } catch (error: any) {
      console.error("❌ Error al notificar deterioro:", error);
      throw error.response?.data || error.message;
    }
  }
}
