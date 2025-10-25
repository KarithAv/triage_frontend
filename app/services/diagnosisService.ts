import axios from "axios";
const API_URL = "https://localhost:7233/api/Diagnosis";
const API2_URL = "https://localhost:7233/api/History";

export default class DiagnosisService {
  static async getAll() {
    try {
      const response = await axios.get(`${API_URL}/get-all`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error al obtener diagnósticos:", error);
      return {
        success: false,
        message: "Error al obtener diagnósticos.",
        data: [],
      };
    }
  }

  static async getById(diagnosisId: number) {
    try {
      const response = await axios.post(`${API_URL}/get-by-id`, {
        diagnosisId: diagnosisId,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error al obtener diagnóstico por ID:", error);
      return {
        success: false,
        message: "Error al obtener diagnóstico por ID.",
        data: null,
      };
    }
  }

  static async getByDocument(documentIdPt: string) {
    try {
      const body = { documentIdPt };
      const response = await axios.post(`${API2_URL}/get-by-document`, body);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error al obtener historial por documento:", error);
      return {
        success: false,
        message: "Error al obtener historial del paciente.",
        data: null,
      };
    }
  }

  static async addDiagnosis(historyId: number, diagnosisId: number) {
    try {
      const body = { historyId, diagnosisId };
      const response = await axios.post(`${API2_URL}/add-diagnosis`, body);
      return {
        success: true,
        message:
          response.data?.message || "Diagnóstico registrado correctamente.",
      };
    } catch (error) {
      console.error("Error al registrar diagnóstico en historial:", error);
      return {
        success: false,
        message: "Error al registrar diagnóstico en el historial.",
      };
    }
  }
}
