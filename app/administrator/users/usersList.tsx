"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import CreateUser from "./createUser"
import EditUser from "./editUser"
import ChangeStatusUser from "./changeStatusUser"
import UserService from "@/app/services/userService"

interface User {
  userId: number
  fullName: string
  identificationUs: string
  emailUs: string
  roleName: string
  stateName: string
  creationDateUs: string
  stateId: number
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const firstRender = useRef(true)

  const loadUsers = async (term?: string) => {
    try {
      const result = await UserService.getUsers(term)
      console.log("Data received:", result.data)
      setUsers(
        (result.data || []).map((user: { stateName: string }) => ({
          ...user,
          stateId: user.stateName === "Activo" ? 1 : 0,
        }))
      )
    } catch (error) {
      console.error("Error loading users:", error)
      setUsers([])
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (search.trim() === "") {
      loadUsers()
    }
  }, [search])

  const handleCreate = () => {
    setSelectedUserId(null)
    setIsEditMode(false)
    setOpenModal(true)
  }

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId)
    setIsEditMode(true)
    setOpenModal(true)
  }

  const handleSearch = () => {
    if (search.trim()) {
      loadUsers(search.trim())
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
        >
          + Crear Usuario
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, cédula o correo..."
              className="font-light w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <Button onClick={handleSearch} className="bg-purple-600 text-white">
              Buscar
            </Button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Nombre Completo</th>
                <th className="p-3">Cédula</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fecha Creación</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.userId} className="border-t">
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">{user.identificationUs}</td>
                    <td className="p-3">{user.emailUs}</td>
                    <td className="p-3">{user.roleName}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full bg-black text-white text-sm">
                        {user.stateName}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(user.creationDateUs).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex justify-center gap-2">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-3 text-center text-gray-500 italic"
                  >
                    No se encontraron usuarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
  )
}
