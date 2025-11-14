import api from "./api"; // 🔥 axios con withCredentials: true

const API_URL = "/Diagnosis";
const API2_URL = "/History";

export default class DiagnosisService {

  // ============================================
  // 1. Obtener todos los diagnósticos
  // ============================================
  static async getAll() {
    try {
      const { data } = await api.get(`${API_URL}/get-all`);
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error("❌ Error al obtener diagnósticos:", error);
      return {
        success: false,
        message: "Error al obtener diagnósticos.",
        data: [],
      };
    }
  }

  // ============================================
  // 2. Obtener diagnóstico por ID
  // ============================================
  static async getById(diagnosisId: number) {
    try {
      const { data } = await api.post(`${API_URL}/get-by-id`, {
        diagnosisId,
      });

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error("❌ Error al obtener diagnóstico por ID:", error);
      return {
        success: false,
        message: "Error al obtener diagnóstico por ID.",
        data: null,
      };
    }
  }

  // ============================================
  // 3. Buscar historial por documento
  // ============================================
  static async getByDocument(documentIdPt: string) {
    try {
      const { data } = await api.post(`${API2_URL}/get-by-document`, {
        documentIdPt,
      });

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error("❌ Error al obtener historial por documento:", error);
      return {
        success: false,
        message: "Error al obtener historial del paciente.",
        data: null,
      };
    }
  }

  // ============================================
  // 4. Registrar diagnóstico en historial
  // ============================================
  static async addDiagnosis(consultationId: number, diagnosisId: number) {
    try {
      const { data } = await api.post(`${API2_URL}/add-diagnosis`, {
        consultationId,
        diagnosisId,
      });

      return {
        success: true,
        message:
          data?.message || "Diagnóstico registrado correctamente.",
      };
    } catch (error: any) {
      console.error("❌ Error al registrar diagnóstico en historial:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al registrar diagnóstico en el historial.",
      };
    }
  }
}
