"use client";

import Image from "next/image";
import { getUser } from "@/app/utilities/session";
import { useEffect, useState } from "react";

export default function NursePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = getUser();
    if (data) {
      setUser(data);
    }
  }, []);

 return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-4">
        Bienvenido {user?.roleName || "Usuario"}
      </h1>

      {user?.firstNameUs && (
        <p className="text-2xl font-bold text-gray-600 mb-4">
          {user.firstNameUs}, nos alegra verte de nuevo.
        </p>
      )}

      <Image
        src="/images/nurse.png"
        alt="Bienvenida enfermer@"
        width={400}
        height={400}
        className="rounded-2xl shadow-lg"
      />
    </div>
  );
}