import axios from "axios";

const API_URL = "https://localhost:7233/api/Alert";

export default class AlertService {
   static async getAllAlerts() {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  }

  static async updateAlertStatus(idAlert: number, idStatus: number) {
    const response = await axios.put(`${API_URL}/${idAlert}/status/${idStatus}`);
    return response.data;
  }

   static async notifyDeterioration(idPatient: number) {
    try {
      const response = await axios.post(`${API_URL}/notify-deterioration`, {
        idPatient: idPatient,
      });
      return response.data;
    } catch (error) {
      console.error("Error al notificar deterioro:", error);
      throw error;
    }
  }
}

