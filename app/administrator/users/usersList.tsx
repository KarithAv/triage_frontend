"use client";

import { Button } from "@/components/button";
import { Card } from "@/components/card";
import Table from "@/components/table";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CreateUser from "./createUser";
import EditUser from "./editUser";
import ChangeStatusUser from "./changeStatusUser";
import UserService from "@/app/services/userService";

interface User {
  userId: number;
  fullName: string;
  identificationUs: string;
  emailUs: string;
  roleName: string;
  stateName: string;
  creationDateUs: string;
  stateId: number;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const firstRender = useRef(true);

  const loadUsers = async (term?: string) => {
    try {
      const result = await UserService.getUsers(term);
      //console.log("Data received:", result.data)
      setUsers(
        (result.data || []).map((user: { stateName: string }) => ({
          ...user,
          stateId: user.stateName === "Activo" ? 1 : 0,
        }))
      );
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (search.trim() === "") {
      loadUsers();
    }
  }, [search]);

  const handleCreate = () => {
    setSelectedUserId(null);
    setIsEditMode(false);
    setOpenModal(true);
  };

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId);
    setIsEditMode(true);
    setOpenModal(true);
  };

  const handleSearch = () => {
    if (search.trim()) {
      loadUsers(search.trim());
    }
  };

  const columns = [
    { key: "fullName", label: "Nombre Completo" },
    { key: "identificationUs", label: "Cédula" },
    { key: "emailUs", label: "Correo" },
    { key: "roleName", label: "Rol" },
    { key: "stateName", label: "Estado" },
    { key: "creationDateUs", label: "Fecha Creación" },
    { key: "acciones", label: "Acciones" },
  ];

  const data = users.map((user) => ({
    fullName: user.fullName,
    identificationUs: user.identificationUs,
    emailUs: user.emailUs,
    roleName: user.roleName,
    stateName: (
      <span
        className={`px-2 py-1 rounded-full text-white text-sm ${
          user.stateName === "Activo" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {user.stateName}
      </span>
    ),
    creationDateUs: new Date(user.creationDateUs).toLocaleDateString(),
    acciones: (
      <div className="flex justify-center gap-2">
        <Button
          variant="secondary"
          className="px-2 py-1"
          onClick={() => handleEdit(user.userId)}
        >
          <Pencil size={16} />
        </Button>
        <ChangeStatusUser
          userId={user.userId}
          stateId={user.stateId}
          onStatusChanged={() => loadUsers()}
        />
      </div>
    ),
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Gestión de Usuarios
        </h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all duration-200"
        >
          + Crear Usuario
        </button>
      </div>

      <Card className="overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex w-full sm:w-auto flex-grow gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, cédula o correo..."
              className="font-light w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <Button
              onClick={handleSearch}
              className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 px-4"
            >
              Buscar
            </Button>
          </div>
        </div>

        <Table columns={columns} data={data} />
      </Card>

      {/* Modal crear/editar */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-[600px] max-h-[90vh] p-6 relative overflow-y-auto">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {isEditMode && selectedUserId ? (
              <EditUser
                userId={selectedUserId}
                onClose={() => setOpenModal(false)}
                onUserUpdated={() => loadUsers()}
              />
            ) : (
              <CreateUser
                onClose={() => setOpenModal(false)}
                onUserCreated={() => loadUsers()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
