// services/patientService.ts
import axios from "axios";

const API_URL = "https://localhost:7233/api/Patient";
const API2_URL = "https://localhost:7233/api/TriagePatient";

export default class PatientService {
  static async createPatient(formData: any) {
    try {
      const payload = {
        documentIdPt: formData.documentId,
        firstNamePt: formData.firstName,
        lastNamePt: formData.lastName,
        birthDatePt: formData.birthDate,
        genderPt: formData.gender === "M", // true si es masculino
        emailPt: formData.email,
        phonePt: formData.phone,
        emergencyContactPt: formData.emergencyContact || undefined,
        addressPt: formData.address || undefined,
      };

      const res = await axios.post(`${API_URL}/create`, payload);

      return {
        Success: true,
        message: res.data.message || "Paciente registrado correctamente",
      };
    } catch (error: any) {
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

  static async getPatients(color?: string) {
    try {
      const url = color ? `${API2_URL}?color=${color}` : `${API2_URL}`;
      const response = await axios.get(url);

      // Unir los signos vitales en un solo objeto por paciente
      const patientsArray = response.data.data || [];
      const patients = patientsArray.map((p: any) => ({
        patientId: p.patientId,
        identification: p.identification,
        fullName: p.fullName,
        gender: p.gender ? "Masculino" : "Femenino",
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
      console.error("Error fetching patients:", error);
      throw error;
    }
  }
}
