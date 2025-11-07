"use client";

import { useState } from "react";
import Alert from "@/components/alert";
import UserService from "@/app/services/userService";

interface CreateUserProps {
    onClose: () => void;
    onUserCreated: () => void;
}

export default function CreateUser({ onClose, onUserCreated }: CreateUserProps) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        identification: "",
        birthDate: "",
        gender: "",
        emergencyContact: "",
        address: "",
        role: "",
        state: "Activo",
    });

    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await UserService.createUser(form);

            if (data.Success) {
                setAlertType("success");
                setAlertMessage(data.message);
                setTimeout(() => {
                    setAlertMessage("");
                    onUserCreated();
                    onClose();
                }, 2000);
            } else {
                setAlertType("error");
                setAlertMessage(data.message); // mensaje de duplicado
            }
        } catch {
            setAlertType("error");
            setAlertMessage("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div>
            <h2 className="text-2xl font-extrabold text-gray-800">Crear Nuevo Usuario</h2>
            <Alert
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertMessage("")}
            />
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-4"
            >
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
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Contraseña temporal"
                    className="col-span-2 border rounded-lg px-3 py-2"
                    type="password"
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
                        {loading ? "Creando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
