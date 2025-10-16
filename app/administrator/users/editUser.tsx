"use client";

import { useState, useEffect } from "react";
import Alert from "@/components/alert";
import UserService from "@/app/services/userService";

interface EditUserProps {
  userId: number;
  onClose: () => void;
  onUserUpdated: () => void;
}

export default function EditUser({ userId, onClose, onUserUpdated }: EditUserProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    identification: "",
    birthDate: "",
    gender: "",
    emergencyContact: "",
    address: "",
    role: "",
    state: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");

  // Cargar usuario al abrir
  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await UserService.getUserById(userId);
        if (result.data) {
          const u = result.data;
          setForm({
            firstName: u.firstNameUs,
            lastName: u.lastNameUs,
            email: u.emailUs,
            phone: u.phoneUs,
            identification: u.identificationUs,
            birthDate: u.birthDateUs?.split("T")[0] ?? "",
            gender: u.genderUs ? "M" : "F",
            emergencyContact: u.emergencyContactUs,
            address: u.addressUs,
            role: u.roleIdUs === 1 ? "admin" : u.roleIdUs === 4 ? "medico" : "enfermero",
            state: u.stateIdUs === 1 ? "Activo" : "Inactivo",
          });
        } else {
          setAlertType("error");
          setAlertMessage("No se pudieron cargar los datos del usuario");
        }
      } catch (error: any) {
        setAlertType("error");
        setAlertMessage(error.message);
      }
    };

    loadUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await UserService.updateUser(userId, form);
      if (result.Success) {
        setAlertType("success");
        setAlertMessage(result.message);
        setTimeout(() => {
          setAlertMessage("");
          onUserUpdated();
          onClose();
        }, 2000);
      } else {
        setAlertType("error");
        setAlertMessage(result.message || "Error al actualizar el usuario");
      }
    } catch (error: any) {
      setAlertType("error");
      setAlertMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
      <Alert
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertMessage("")}
      />
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Nombre"
          className="border rounded-lg px-3 py-2"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Apellido"
          className="border rounded-lg px-3 py-2"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="col-span-2 border rounded-lg px-3 py-2"
          type="email"
          required
        />
        <input
          name="identification"
          value={form.identification}
          onChange={handleChange}
          placeholder="Cédula"
          className="col-span-2 border rounded-lg px-3 py-2"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Teléfono"
          className="col-span-2 border rounded-lg px-3 py-2"
          required
        />
        <input
          name="birthDate"
          type="date"
          value={form.birthDate}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border rounded-lg px-3 py-2"
          required
        >
          <option value="">Sexo Biológico</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <input
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
          placeholder="Contacto de emergencia"
          className="col-span-2 border rounded-lg px-3 py-2"
          required
        />
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Dirección"
          className="col-span-2 border rounded-lg px-3 py-2"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="col-span-2 border rounded-lg px-3 py-2"
          required
        >
          <option value="">Seleccione un rol</option>
          <option value="admin">Administrador</option>
          <option value="medico">Médico</option>
          <option value="enfermero">Enfermero</option>
        </select>
        <select
          name="state"
          value={form.state}
          onChange={handleChange}
          className="col-span-2 border rounded-lg px-3 py-2"
          required
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            {loading ? "Actualizando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
