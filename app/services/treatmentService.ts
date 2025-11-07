import axios from "axios";

const API_URL = "https://localhost:7233/api/Exam";
const API2_URL = "https://localhost:7233/api/Medication";
const API3_URL = "https://localhost:7233/api/Treatment";

export default class TreatmentService {
  // Obtener todos los exámenes
  static async getAllExams() {
    try {
      const response = await axios.get(`${API_URL}/get-all`);

      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error("Error al obtener exámenes:", error);
      return {
        success: false,
        message: "Error al obtener la lista de exámenes.",
        data: [],
      };
    }
  }

  //  Obtener todos los medicamentos
  static async getAllMedication() {
    try {
      const response = await axios.get(`${API2_URL}/get-all`);

      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return {
        success: false,
        message: "Error al obtener la lista de medicamentos.",
        data: [],
      };
    }
  }
  static async registerTreatment(data: {
    consultationId: number;
    description: string;
    medicationIds: number[];
    examIds: number[];
  }) {
    try {
      const response = await axios.post(`${API3_URL}/register`, data);
      return {
        success: true,
        message: "Tratamiento registrado con exito. Consulta finalizada ",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error al registrar tratamiento:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al registrar el tratamiento.",
      };
    }
  }
}
