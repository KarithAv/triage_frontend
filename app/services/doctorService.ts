import axios from "axios";

const API_URL = "https://localhost:7233/api/MedicListP";

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
}
