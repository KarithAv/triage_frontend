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
  // doctorService.ts
  static async getTriageDetails(idTriage: number) {
    try {
      const response = await axios.get(`${API2_URL}/details/${idTriage}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles del triage:", error);
      throw error;
    }
  }
}
