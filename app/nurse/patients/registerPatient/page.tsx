"use client";

import { useState } from "react";
import Alert from "@/components/alert";
import PatientService from "@/app/services/patientService";

export default function RegisterPatientPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        documentId: "",
        birthDate: "",
        gender: "",
        phone: "",
        emergencyContact: "",
        address: "",
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
        setAlertMessage("");

        try {
            const result = await PatientService.createPatient(form);

            if (result.Success) {
                setAlertType("success");
                setAlertMessage(result.message);

                setTimeout(() => {
                    setAlertMessage("");
                }, 2000);

                setForm({
                    firstName: "",
                    lastName: "",
                    email: "",
                    documentId: "",
                    birthDate: "",
                    gender: "",
                    phone: "",
                    emergencyContact: "",
                    address: "",
                });
            } else {
                setAlertType("error");
                setAlertMessage(result.message);
            }
        } catch {
            setAlertType("error");
            setAlertMessage("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Registrar Nuevo Paciente</h2>

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
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    className="col-span-2 border rounded-lg px-3 py-2"
                    required
                />
                <input
                    name="documentId"
                    value={form.documentId}
                    onChange={handleChange}
                    placeholder="Documento de identidad"
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

                {/* Fecha de nacimiento */}
                <div className="flex flex-col">
                    <label htmlFor="birthDate" className="text-sm text-gray-700 mb-1">
                        Fecha de nacimiento
                    </label>
                    <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={form.birthDate}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2"
                        required
                    />
                </div>

                {/* Sexo */}
                <div className="flex flex-col">
                    <label htmlFor="gender" className="text-sm text-gray-700 mb-1">
                        Sexo
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="border rounded-lg px-3 py-2"
                        required
                    >
                        <option value="">Seleccionar</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>

                <input
                    name="emergencyContact"
                    value={form.emergencyContact}
                    onChange={handleChange}
                    placeholder="Contacto de emergencia"
                    className="col-span-2 border rounded-lg px-3 py-2"
                />
                <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Dirección"
                    className="col-span-2 border rounded-lg px-3 py-2"
                />

                <div className="col-span-2 flex justify-end gap-3 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
                    >
                        {loading ? "Registrando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}