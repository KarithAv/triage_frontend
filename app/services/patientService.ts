// services/patientService.ts
import api from "./api"; // 🔥 usa axios con withCredentials

export default class PatientService {
  // -------------------------------------------------
  // Crear paciente
  // -------------------------------------------------
  static async createPatient(formData: any) {
    try {
      const payload = {
        documentIdPt: formData.documentId,
        firstNamePt: formData.firstName,
        lastNamePt: formData.lastName,
        birthDatePt: formData.birthDate,
        genderPt: formData.gender === "M",
        emailPt: formData.email,
        phonePt: formData.phone,
        emergencyContactPt: formData.emergencyContact || null,
        addressPt: formData.address || null,
      };

      const res = await api.post(`/Patient/create`, payload);

      return {
        Success: true,
        message: res.data.message || "Paciente registrado correctamente",
      };
    } catch (error: any) {
      console.error("❌ Error creando paciente:", error);

      if (error.response?.status === 400) {
        return {
          Success: false,
          message: error.response.data.message,
        };
      }

      return {
        Success: false,
        message: "Ocurrió un error inesperado al registrar el paciente",
      };
    }
  }

  // -------------------------------------------------
  // Listar pacientes en triage (filtro por color)
  // -------------------------------------------------
  static async getPatients(color?: string) {
    try {
      const url = color
        ? `/TriagePatient?color=${color}`
        : `/TriagePatient`;

      const response = await api.get(url);

      const patientsArray = response.data.data || [];

      // Unir signos vitales en un solo objeto limpio
      const patients = patientsArray.map((p: any) => ({
        triageId: p.triageId,
        patientId: p.patientId,
        identification: p.identification,
        fullName: p.fullName,
        gender: p.gender,
        age: p.age,
        symptoms: p.symptoms || "-",
        temperature: p.temperature ?? 0,
        heartRate: p.heartRate ?? 0,
        bloodPressure: p.bloodPressure ?? "-",
        respiratoryRate: p.respiratoryRate ?? 0,
        oxygenSaturation: p.oxygenSaturation ?? 0,
        priorityName: p.priorityName || "Sin prioridad",
      }));

      return { data: patients };
    } catch (error) {
      console.error("❌ Error obteniendo pacientes:", error);
      throw new Error("Error al obtener la lista de pacientes");
    }
  }

  // -------------------------------------------------
  // Obtener paciente por documento
  // -------------------------------------------------
  static async getPatientByDocument(document: string) {
    try {
      const response = await api.post(
        `/Patient/get-by-document`,
        { documentIdPt: document }
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ Error getPatientByDocument:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al buscar el paciente.",
      };
    }
  }

  // -------------------------------------------------
  // Obtener información completa del paciente (triage)
  // -------------------------------------------------
  static async getTriagePatient(triageId: number) {
    try {
      const response = await api.post(
        `/TriageResult/getTriagePatient`,
        { triageId }
      );

      return response.data;
    } catch (error: any) {
      console.error("❌ Error getTriagePatient:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al cargar la información del paciente.",
      };
    }
  }

  // -------------------------------------------------
  // Obtener estado del paciente (vista paciente)
  // -------------------------------------------------
  static async getPatientStatus(idPatient: number) {
    try {
      const response = await api.get(`/PriorityUpdate/status/patient/${idPatient}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error getPatientStatus:", error);
      throw new Error("No se pudo obtener el estado del paciente");
    }
  }
}
