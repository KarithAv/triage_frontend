import api from "./api"; 

const API_URL = "/MedicListP";
const API2_URL = "/TriageFullInfo";
const API3_URL = "/Consultation";

export default class DoctorService {

  // ================================
  // 1. Obtener lista filtrada de pacientes
  // ================================
  static async getAllFiltered(fullName: string, identification: string) {
    try {
      const { data } = await api.post(`${API_URL}/GetAllFiltered`, {
        fullName,
        identification,
      });
      return data;
    } catch (error: any) {
      console.error("❌ Error al obtener la lista de pacientes:", error);
      throw error.response?.data || error.message;
    }
  }

  // ================================
  // 2. Obtener detalles de un triage
  // ================================
  static async getTriageDetails(idTriage: number) {
    try {
      const { data } = await api.get(`${API2_URL}/details/${idTriage}`);
      return data;
    } catch (error: any) {
      console.error("❌ Error al obtener detalles del triage:", error);
      throw error.response?.data || error.message;
    }
  }

  // ================================
  // 3. Obtener historial clínico completo
  // ================================
  static async getConsultationHistory(patientId: number) {
    try {
      const { data } = await api.get(`${API2_URL}/history/${patientId}`);

      return {
        success: true,
        data: data.data || [],
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message:
            "No hay historial clínico registrado para este paciente.",
        };
      }

      console.error("❌ Error al obtener historial:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al obtener el historial clínico.",
      };
    }
  }

  // ================================
  // 4. Iniciar consulta médica
  // ================================
  static async startConsultation(idMedic: number, idTriage: number) {
    try {
      const { data } = await api.post(`${API3_URL}/start`, {
        idMedic,
        idTriage,
      });

      return {
        success: data.success || false,
        message: data.message || "Error al iniciar la consulta.",
        consultationId: data.consultationId || null,
      };
    } catch (error: any) {
      console.error("❌ Error al iniciar la consulta médica:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Ocurrió un error al iniciar la consulta.",
        consultationId: null,
      };
    }
  }
}
