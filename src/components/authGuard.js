"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const AuthGuard = (WrappedComponent) => {
  const WithAuthGuard = (props) => {
    const router = useRouter();
    const user = useSelector((state) => state.useReducer.user); // Ajusta el selector según tu slice
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simula la carga de estado inicial
      const checkUser = async () => {
        setLoading(true);
        // Aquí podrías hacer una verificación adicional si es necesario
        setLoading(false);
      };

      checkUser();
    }, [user, router]);

    useEffect(() => {
      if (!loading && !user) {
        router.push("/Sign-in");
      }
    }, [user, loading, router]);

    // Mientras se carga el estado, muestra un loader o nada
    if (loading) {
      return <div>Loading...</div>; // Cambia esto según tus necesidades
    }

    // Si el usuario no está autenticado, no renderiza el componente envuelto.
    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthGuard.displayName = `WithAuthGuard(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthGuard;
};

export default AuthGuard;
