// services/patientService.ts
import axios from "axios";

const API_URL = "https://localhost:7233/api/Patient";

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
}
