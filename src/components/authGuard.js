"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const AuthGuard = (WrappedComponent) => {
  const WithAuthGuard = (props) => {
    const router = useRouter();
    const user = useSelector((state) => state.useReducer.user); // Ajusta el selector según tu slice

    useEffect(() => {
      if (!user) {
        router.push("/Sign-in");
      }
    }, [user, router]);

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
