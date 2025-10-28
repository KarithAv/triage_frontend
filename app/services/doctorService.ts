import axios from "axios";

const API_URL = "https://localhost:7233/api/MedicListP";
const API2_URL = "https://localhost:7233/api/TriageFullInfo";

export default class DoctorService {
  static async getAllFiltered(fullName: string, identification: string) {
    try {
      const response = await axios.post(`${API_URL}/GetAllFiltered`, {
        fullName,
        identification,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener la lista de pacientes:", error);
      throw error;
    }
  }

  static async getTriageDetails(idTriage: number) {
    try {
      const response = await axios.get(`${API2_URL}/details/${idTriage}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles del triage:", error);
      throw error;
    }
  }

  static async getConsultationHistory(patientId: number) {
    try {
      const response = await axios.get(`${API2_URL}/history/${patientId}`);
      return { success: true, data: response.data.data || [] };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: "No hay historial clínico registrado para este paciente.",
        };
      }
      console.error("Error al obtener historial:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al obtener el historial clínico.",
      };
    }
  }

  static async startConsultation(idMedic: number, idTriage: number) {
    try {
      const response = await axios.post(
        `https://localhost:7233/api/Consultation/start`,
        {
          idTriage,
          idMedic,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al iniciar la consulta médica:", error);
      throw error;
    }
  }
}
