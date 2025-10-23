import axios from "axios";
import { getUser, getUserId } from "@/app/utilities/session";

const API_URL = "https://localhost:7233/api/Triage";
const API2_URL = "https://localhost:7233/api/TriageResult";

export default class TriageService {
  static async registerTriage(data: {
    vitalSigns: {
      heartRate: number;
      respiratoryRate: number;
      bloodPressure: string;
      temperature: number;
      oxygenSaturation: number;
    };
    symptoms: string;
    idPatient: number;
    patientAge: number;
  }) {
    try {
      const idNurse = getUserId();
      console.log(idNurse);
      if (!idNurse) {
        throw new Error("No se encontró un enfermero logueado en la sesión.");
      }

      const payload = {
        vitalSigns: data.vitalSigns,
        symptoms: data.symptoms,
        iD_Patient: data.idPatient,
        iD_Doctor: 0, // por ahora queda en 0
        iD_Nurse: idNurse,
        patientAge: data.patientAge,
      };

      const response = await axios.post(`${API_URL}/register`, payload);
      const { idTriage, suggestedLevel, confidence, message } = response.data;

      return {
        success: true,
        message: "Paciente registrado exitosamente",
        idTriage,
        suggestedLevel,
        confidence,
        messageApi: message,
      };
    } catch (error: any) {
      console.error("Error al registrar triage:", error);
      throw error.response?.data || error.message;
    }
  }

  static async getAllPriorities() {
    try {
      const response = await axios.get(`${API2_URL}/allPriorities`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("No se pudieron obtener las prioridades");
      }
    } catch (error: any) {
      console.error("Error al obtener prioridades:", error);
      throw error.response?.data || error.message;
    }
  }

  static async getTriageSuggestion(triageId: number) {
    try {
      const response = await axios.get(`${API2_URL}/priorityInfo/${triageId}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "No se pudo obtener la sugerencia de IA"
        );
      }
    } catch (error: any) {
      console.error("Error al obtener sugerencia de IA:", error);
      throw error.response?.data || error.message;
    }
  }
  static async registerTriageResult(data: {
    TriageId: number;
    PriorityId: number;
    NurseId: number;
    IsFinalPriority: boolean;
  }) {
    try {
      const response = await axios.post(`${API2_URL}/register`, data);
      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error al registrar el resultado del triage:", error);
      throw error.response?.data || error.message;
    }
  }
}
