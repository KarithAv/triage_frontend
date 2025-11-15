// app/services/userService.ts
import api from "./api"; // 🔥 Usa el cliente con withCredentials: true

export default class UserService {
  
  // --------------------------------------------------------
  // Obtener lista de usuarios
  // --------------------------------------------------------
  static async getUsers(searchTerm?: string) {
    try {
      const url = searchTerm && searchTerm.trim().length > 0
        ? `/User?searchTerm=${searchTerm}`
        : `/User`;

      const res = await api.get(url);
      return res.data; // { message, data }
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("No se pudo obtener los usuarios");
    }
  }

  // --------------------------------------------------------
  // Obtener usuario por ID
  // --------------------------------------------------------
  static async getUserById(userId: number) {
    try {
      const res = await api.get(`/User/GetUserById/${userId}`);
      return res.data; // { message, data }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  }

  // --------------------------------------------------------
  // Crear usuario
  // --------------------------------------------------------
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

        // 🔥 Asignación REAL según ID de la tabla ROL
        // 1 → Admin
        // 2 → Enfermero
        // 3 → Paciente
        // 4 → Médico
        roleIdUs:
          formData.role === "admin"
            ? 1
            : formData.role === "enfermero"
            ? 2
            : formData.role === "paciente"
            ? 3
            : 4,

        stateIdUs: formData.state === "Activo" ? 1 : 0,
      };

      const res = await api.post(`/User/create`, payload);
      return { Success: true, message: res.data.message };

    } catch (error: any) {
      if (error.response?.status === 400) {
        return { Success: false, message: error.response.data.message };
      }
      return {
        Success: false,
        message: "Ocurrió un error inesperado al crear el usuario",
      };
    }
  }

  // --------------------------------------------------------
  // Actualizar usuario
  // --------------------------------------------------------
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

        roleIdUs:
          formData.role === "admin"
            ? 1
            : formData.role === "enfermero"
            ? 2
            : formData.role === "paciente"
            ? 3
            : 4,

        stateIdUs: formData.state === "Activo" ? 1 : 0,
      };

      const res = await api.put(`/User/UpdateUser/${userId}`, payload);
      return { Success: true, message: res.data.message };

    } catch (error: any) {
      if (error.response?.status === 409) {
        return { Success: false, message: error.response.data.message };
      }
      return { Success: false, message: "Ocurrió un error inesperado" };
    }
  }

  // --------------------------------------------------------
  // Cambiar estado de usuario
  // --------------------------------------------------------
  static async changeUserStatus(userId: number, newState: number) {
    try {
      const res = await api.put(
        `/User/ChangeStatus/${userId}?newState=${newState}`
      );
      return res.data;
    } catch (error) {
      console.error("Error cambiando estado del usuario:", error);
      throw new Error("No se pudo cambiar el estado del usuario");
    }
  }
}
