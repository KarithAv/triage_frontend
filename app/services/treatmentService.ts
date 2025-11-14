import api from "./api"; 

export default class TreatmentService {

  // --------------------------------------------------------
  // Obtener todos los exámenes
  // --------------------------------------------------------
  static async getAllExams() {
    try {
      const response = await api.get("/Exam/get-all");

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

  // --------------------------------------------------------
  // Obtener todos los medicamentos
  // --------------------------------------------------------
  static async getAllMedication() {
    try {
      const response = await api.get("/Medication/get-all");

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

  // --------------------------------------------------------
  // Registrar tratamiento médico
  // --------------------------------------------------------
  static async registerTreatment(data: {
    consultationId: number;
    description: string;
    medicationIds: number[];
    examIds: number[];
  }) {
    try {
      const response = await api.post("/Treatment/register", data);

      return {
        success: true,
        message: "Tratamiento registrado con éxito. Consulta finalizada.",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error al registrar tratamiento:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al registrar el tratamiento.",
      };
    }
  }
}
