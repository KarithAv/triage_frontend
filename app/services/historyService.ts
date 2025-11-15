// app/services/historyService.ts
import api from "./api";

// Base URL usando api (ya tiene /api como baseURL)
const API_URL = "/patients";

const HistoryService = {
  /**
   * Obtener historial paginado
   */
  async getPatientHistory(
    patientId: number,
    from?: string,
    to?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const params: any = { page, limit };
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await api.get(`${API_URL}/${patientId}/HistoryReport`, {
      params,
    });

    return res.data;
  },

  /**
   * Obtener una consulta específica del historial
   */
  async getConsultationById(patientId: number, consultaId: number) {
    const res = await api.get(
      `${API_URL}/${patientId}/HistoryReport/${consultaId}`
    );
    return res.data;
  },

  /**
   * Descargar PDF del historial
   */
  async downloadHistoryPdf(patientId: number, from?: string, to?: string) {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await api.get(
      `${API_URL}/${patientId}/HistoryReport/pdf/download`,
      {
        params,
        responseType: "blob",
      }
    );

    return res.data;
  },
};

export default HistoryService;
