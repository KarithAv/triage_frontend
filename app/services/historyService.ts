// app/services/historyService.ts
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://localhost:7233/api/patients";

const HistoryService = {
  /**
   * Obtiene historial paginado.
   * from/to opcionales
   */
  async getPatientHistory(
    patientId: number,
    from?: string,
    to?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    params.page = page;
    params.limit = limit;

    const res = await axios.get(`${API_URL}/${patientId}/HistoryReport`, {
      params,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.data;
  },

  /**
   * Obtiene una consulta por ID desde tu backend
   */
  async getConsultationById(patientId: number, consultaId: number) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const res = await axios.get(
      `${API_URL}/${patientId}/HistoryReport/${consultaId}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return res.data;
  },

  /**
   * Descarga PDF del historial
   */
  async downloadHistoryPdf(patientId: number, from?: string, to?: string) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await axios.get(
      `${API_URL}/${patientId}/HistoryReport/pdf/download`,
      {
        params,
        responseType: "blob",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return res.data;
  },
};

export default HistoryService;
