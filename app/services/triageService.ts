import axios from "axios";
import { getUser, getUserId } from "@/app/utilities/session";

const API_URL = "https://localhost:7233/api/Triage";

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
      return {
        success: true,
        message: "Paciente registrado exitosamente ✅",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error al registrar triage:", error);
      throw error.response?.data || error.message;
    }
  }
}
