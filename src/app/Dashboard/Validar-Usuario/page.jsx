"use client";

import { data } from "../../../../public/data";
import Image from "next/image";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";


const Page = () => {

  const users = data.users.filter((user) => user.role === "Customer");


  const [usuarios, setUsuarios] = useState(users);

  const handleValidar = (id) => {
    setUsuarios(usuarios.filter((user) => user._id !== id));
    toast.success("Usuario Validado");
  };

  const handleInvalidar = (id) => {
    setUsuarios(usuarios.filter((user) => user._id !== id));
    toast.error("Usuario Invalidado");
  };

  return (
    <div className="p-6 items-center">
      <h1 className="text-3xl font-bold">Lista de usuarios</h1>
      <div>
        <div className="mt-20 px-10">
          {usuarios.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-center p-2 mr-4"></th>
                  <th className="text-center p-2">Nombre</th>
                  <th className="text-center p-2">Email</th>
                  <th className="text-center p-2">Rol</th>
                  <th className="text-center p-2">Teléfono</th>
                  <th className="text-center p-2">Dirección</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((item) => (
                  <tr key={item._id} className="border-b text-sm">
                    <td className="p-2">
                      <Image
                        width={150}
                        height={150}
                        src={item.image}
                        alt={item.name}
                        className="object-contain  mr-4 rounded-full"
                      />
                    </td>
                    <td className="p-2 text-center">{item.name}</td>
                    <td className="p-2 text-center">{item.email}</td>
                    <td className="p-2 text-center">{item.role}</td>
                    <td className="p-2 text-center">{item.phone}</td>
                    <td className="p-2 text-center">{item.address.city}</td>
                    <td className="p-2 text-center">
                      <button
                        className="bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-800 focus:outline-none cursor-pointer"
                        onClick={() => handleValidar(item._id)}
                      >
                        Validar
                      </button>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-800 focus:outline-none cursor-pointer"
                        onClick={() => handleInvalidar(item._id)}
                      >
                        Deshabilitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">
              No se encontraron usuarios para validar
            </p>
          )}
        </div>
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default Page;
