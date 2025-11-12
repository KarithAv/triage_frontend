import axios from "axios";

const API_URL = "https://localhost:7233/api";

export default class DashboardService {
  // Obtener todas las prioridades
  static async getPriorities() {
    const { data } = await axios.get(`${API_URL}/TriageResult/allPriorities`);
    return data.data;
  }

  // Obtener doctores
  static async getDoctors() {
    const { data } = await axios.get(`${API_URL}/dashboard/doctors`);
    return data;
  }

  // Obtener enfermeros
  static async getNurses() {
    const { data } = await axios.get(`${API_URL}/dashboard/nurses`);
    return data;
  }

  // 🔹 API 1: Promedio de tiempos
  static async getAverageTimes(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    const body = {
      startDate: params.startDate,
      endDate: params.endDate,
      priorityId: params.priorityId ?? null,
      doctorId: params.doctorId ?? null,
      nurseId: params.nurseId ?? null,
    };

    const { data } = await axios.post(
      `${API_URL}/dashboard/average-times`,
      body
    );
    return data;
  }

  // 🔹 API 2: Total de atenciones por semana
  static async getAttentions(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    const body = {
      startDate: params.startDate,
      endDate: params.endDate,
      priorityId: params.priorityId ?? null,
      doctorId: params.doctorId ?? null,
      nurseId: params.nurseId ?? null,
    };

    const { data } = await axios.post(`${API_URL}/dashboard/attentions`, body);
    return data; // [{ week, totalPatients }]
  }

  // 🔹 API 3: Distribución por prioridad
  static async getPriorityDistribution(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    const body = {
      startDate: params.startDate,
      endDate: params.endDate,
      priorityId: params.priorityId ?? null,
      doctorId: params.doctorId ?? null,
      nurseId: params.nurseId ?? null,
    };

    const { data } = await axios.post(
      `${API_URL}/dashboard/priority-distribution`,
      body
    );
    return data; // [{ priorityName, totalPatients, percentage }]
  }

  // 🔹 API 4: Frecuencia de diagnósticos
  static async getDiagnosisFrequency(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    const body = {
      startDate: params.startDate,
      endDate: params.endDate,
      priorityId: params.priorityId ?? null,
      doctorId: params.doctorId ?? null,
      nurseId: params.nurseId ?? null,
    };

    const { data } = await axios.post(
      `${API_URL}/dashboard/diagnosis-frequency`,
      body
    );
    return data; // [{ diagnosisName, totalOccurrences, percentage }]
  }
}
