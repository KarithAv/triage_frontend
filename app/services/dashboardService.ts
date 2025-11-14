import api from "./api";

const API_URL = "/Dashboard"; 

export default class DashboardService {

  // -------------------------------------------------
  // Obtener prioridades (se llama desde otro controlador)
  // -------------------------------------------------
  static async getPriorities() {
    try {
      const { data } = await api.get(`/TriageResult/allPriorities`);
      return data.data;
    } catch (error) {
      console.error("Error obteniendo prioridades:", error);
      throw new Error("No se pudieron obtener las prioridades.");
    }
  }

  // -------------------------------------------------
  // Obtener doctores
  // -------------------------------------------------
  static async getDoctors() {
    try {
      const { data } = await api.get(`${API_URL}/doctors`);
      return data.data ?? data;
    } catch (error) {
      console.error("Error obteniendo doctores:", error);
      throw new Error("No se pudo obtener la lista de doctores.");
    }
  }

  // -------------------------------------------------
  // Obtener enfermeros
  // -------------------------------------------------
  static async getNurses() {
    try {
      const { data } = await api.get(`${API_URL}/nurses`);
      return data.data ?? data;
    } catch (error) {
      console.error("Error obteniendo enfermeros:", error);
      throw new Error("No se pudo obtener la lista de enfermeros.");
    }
  }

  // -------------------------------------------------
  // API 1: Promedio de tiempos
  // -------------------------------------------------
  static async getAverageTimes(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    try {
      const { data } = await api.post(`${API_URL}/average-times`, params);
      return data;
    } catch (error) {
      console.error("Error obteniendo promedios:", error);
      throw new Error("No se pudieron obtener los tiempos promedio.");
    }
  }

  // -------------------------------------------------
  // API 2: Total de atenciones por semana
  // -------------------------------------------------
  static async getAttentions(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    try {
      const { data } = await api.post(`${API_URL}/attentions`, params);
      return data;
    } catch (error) {
      console.error("Error obteniendo atenciones:", error);
      throw new Error("No se pudo obtener el total de atenciones.");
    }
  }

  // -------------------------------------------------
  // API 3: Distribución por prioridad
  // -------------------------------------------------
  static async getPriorityDistribution(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    try {
      const { data } = await api.post(`${API_URL}/priority-distribution`, params);
      return data;
    } catch (error) {
      console.error("Error obteniendo distribución:", error);
      throw new Error("No se pudo obtener la distribución por prioridad.");
    }
  }

  // -------------------------------------------------
  // API 4: Frecuencia de diagnósticos
  // -------------------------------------------------
  static async getDiagnosisFrequency(params: {
    startDate: string;
    endDate: string;
    priorityId?: number | null;
    doctorId?: number | null;
    nurseId?: number | null;
  }) {
    try {
      const { data } = await api.post(`${API_URL}/diagnosis-frequency`, params);
      return data;
    } catch (error) {
      console.error("Error obteniendo diagnósticos:", error);
      throw new Error("No se pudo obtener la frecuencia de diagnósticos.");
    }
  }
}
