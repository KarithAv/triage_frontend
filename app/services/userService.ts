// app/services/userService.ts
import axios from "axios";

const API_URL = "https://localhost:7233/api/User";

export default class UserService {
  static async getUsers(searchTerm?: string) {
    try {
      const url = searchTerm && searchTerm.trim().length > 0
        ? `${API_URL}?searchTerm=${searchTerm}`
        : API_URL;
      const res = await axios.get(url);
      return res.data; // { message, data }
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("No se pudo obtener los usuarios");
    }
  }

  static async getUserById(userId: number) {
    try {
      const res = await axios.get(`${API_URL}/GetUserById/${userId}`);
      return res.data; // { message, data }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  }

 static async createUser(formData: any) {
    try {
      const payload = {
        firstNameUs: formData.firstName,
        lastNameUs: formData.lastName,
        emailUs: formData.email,
        passwordUs: formData.password,
        phoneUs: formData.phone,
        identificationUs: formData.identification,
        birthDateUs: formData.birthDate,
        genderUs: formData.gender === "M",
        emergencyContactUs: formData.emergencyContact,
        addressUs: formData.address,
        roleIdUs: formData.role === "admin" ? 1 : formData.role === "medico" ? 4 : 2,
        stateIdUs: formData.state === "Activo" ? 1 : 0,
      };

      const res = await axios.post(`${API_URL}/create`, payload);
      return { Success: true, message: res.data.message };

    } catch (error: any) {
      if (error.response?.status === 400) {
        return { Success: false, message: error.response.data.message };
      }
      return { Success: false, message: "Ocurrió un error inesperado al crear el usuario" };
    }
  }

  static async updateUser(userId: number, formData: any) {
  try {
    const payload = {
      userId,
      firstNameUs: formData.firstName,
      lastNameUs: formData.lastName,
      emailUs: formData.email,
      phoneUs: formData.phone,
      identificationUs: formData.identification,
      birthDateUs: formData.birthDate,
      genderUs: formData.gender === "M",
      emergencyContactUs: formData.emergencyContact,
      addressUs: formData.address,
      roleIdUs: formData.role === "admin" ? 1 : formData.role === "medico" ? 4 : 2,
      stateIdUs: formData.state === "Activo" ? 1 : 0,
    };

    const res = await axios.put(`${API_URL}/UpdateUser/${userId}`, payload);
    return { Success: true, message: res.data.message };

  } catch (error: any) {
    if (error.response?.status === 409) {
      return { Success: false, message: error.response.data.message };
    }
    return { Success: false, message: "Ocurrió un error inesperado" };
  }
}

  static async changeUserStatus(userId: number, newState: number) {
    try {
      const res = await axios.put(`${API_URL}/ChangeStatus/${userId}?newState=${newState}`);
      return res.data;
    } catch (error) {
      console.error("Error cambiando estado del usuario:", error);
      throw new Error("No se pudo cambiar el estado del usuario");
    }
  }
}
