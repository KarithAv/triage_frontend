import axios from "axios";

const API_URL = "https://localhost:7233/api";

export default class DashboardService {
  // 🔹 Obtener todas las prioridades
  static async getPriorities() {
    const { data } = await axios.get(`${API_URL}/TriageResult/allPriorities`);
    return data.data; // devuelve solo el arreglo de prioridades
  }

  // 🔹 Obtener doctores
  static async getDoctors() {
    const { data } = await axios.get(`${API_URL}/dashboard/doctors`);
    return data;
  }

  // 🔹 Obtener enfermeros
  static async getNurses() {
    const { data } = await axios.get(`${API_URL}/dashboard/nurses`);
    return data;
  }

  // 🔹 Obtener datos del dashboard (API principal)
  static async getDashboardData(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    // Si no hay selección, envía null
    const body = {
      startDate: params.startDate,
      endDate: params.endDate,
      priorityId: params.priorityId ?? null,
      doctorId: params.doctorId ?? null,
      nurseId: params.nurseId ?? null,
    };

    const { data } = await axios.post(`${API_URL}/dashboard/average-times`, body);
    return data;
  }
}
