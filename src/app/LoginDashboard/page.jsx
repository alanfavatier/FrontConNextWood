"use client";
import React, { useState } from "react";
import { data } from "../../../public/data";
import { validateRegisterForm, validateLoginForm } from "./formValidation";

// Iconos
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaGoogle } from "react-icons/fa";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast, Toaster } from "react-hot-toast";
import {
  WelcomeMessage,
  WelcomeMessageLogin,
} from "../../components/WelcomeMessage/WelcomeMessage";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signIn } from "next-auth/react"; // Asegúrate de importar signIn

const envelopeIcon = <FontAwesomeIcon icon={faEnvelope} />;
const userIcon = <FontAwesomeIcon icon={faUser} />;
const lockIcon = <FontAwesomeIcon icon={faLock} />;

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const dataUser = data.users;

  // Estado para validaciones de formularios
  const [formErrors, setFormErrors] = useState({});
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Estado para mensajes de bienvenida
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [welcomeMessageLogin, setWelcomeMessageLogin] = useState("");

  // Estado para los formularios
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loginFormData, setLoginFormData] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  // Función para ocultar o mostrar la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Funciones para mostrar los formularios
  const showLoginFormView = () => {
    setShowLoginForm(true);
    setShowRegisterForm(false);
  };

  const showRegisterFormView = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  // Función para manejar cambios en los formularios
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (showRegisterForm) {
      setRegisterFormData({
        ...registerFormData,
        [name]: value,
      });
    } else {
      setLoginFormData({
        ...loginFormData,
        [name]: value,
      });
    }
  };

  // Función para validar los formularios
  const validateForm = () => {
    const formData = showRegisterForm ? registerFormData : loginFormData;
    const errors = showRegisterForm
      ? validateRegisterForm(formData)
      : validateLoginForm(formData);

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejo del registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Aquí se asume que newUser es una función de mutación que deberías definir
        // const response = await newUser(registerFormData);

        // Simulación de respuesta
        const response = { error: null };

        if (response.error) {
          toast.error("Este correo electrónico ya existe");
        } else {
          const { name, email, password } = registerFormData;
          setWelcomeMessage(`Hola ${name}!`);

          try {
            const loginResponse = await signIn("credentials", {
              redirect: false,
              email,
              password,
            });

            if (loginResponse?.ok) {
              setWelcomeMessageLogin(`¡Hola de nuevo ${name}!`);
              dispatch({ type: "LOGIN_SUCCESS", payload: loginResponse });
              router.push("/Dashboard");
            } else {
              toast.error("Error en el inicio de sesión");
            }

            setLoginFormData({
              loginEmail: "",
              loginPassword: "",
            });
          } catch (error) {
            console.error("Error al iniciar sesión automáticamente:", error);
          }
        }
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
      }
    } else {
      console.log("Formulario de registro inválido");
    }
  };

  // Manejo del inicio de sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const user = dataUser.find(
          (user) =>
            user.email === loginFormData.loginEmail &&
            user.password === loginFormData.loginPassword
        );

        if (user) {
          if (user.role === "vendedor" || user.role === "admin") {
            setWelcomeMessageLogin(`¡Hola de nuevo ${user.name}!`);
            router.push("/Dashboard");
          } else {
            toast.error(
              "Permiso denegado. Solo vendedores y administradores pueden acceder."
            );
          }
        } else {
          toast.error("Correo electrónico o contraseña incorrectos.");
        }

        setLoginFormData({
          loginEmail: "",
          loginPassword: "",
        });
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        toast.error("Error al iniciar sesión");
      }
    } else {
      console.log("Formulario de inicio de sesión inválido");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-4 rounded shadow-xl w-96 flex flex-col">
        {showRegisterForm && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center font-serif mx-auto mt-4">
              Registrarse
            </h1>
            <form onSubmit={handleRegisterSubmit}>
              {/* Nombre */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nombre"
                  value={registerFormData.name}
                  onChange={handleChange}
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              {/* Apellido */}
              <div className="mb-4">
                <label
                  htmlFor="lastname"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Apellido"
                  value={registerFormData.lastname}
                  onChange={handleChange}
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                />
                {formErrors.lastname && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.lastname}
                  </p>
                )}
              </div>
              {/* Correo Electrónico */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {envelopeIcon} Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={registerFormData.email}
                  onChange={handleChange}
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              {/* Contraseña */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {lockIcon} Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Contraseña"
                    value={registerFormData.password}
                    onChange={handleChange}
                    className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 w-full bg-teal-500 text-white rounded px-4 py-2 hover:bg-teal-600 focus:outline-none"
                >
                  Registrarse
                </button>
              </div>
              <Toaster position="top-center" />
            </form>
            <div className="mt-2 flex flex-col">
              <h1 className="mt-2">¿Ya tienes una cuenta?</h1>
              <button
                className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 mt-2 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-800 focus:outline-none"
                onClick={showLoginFormView}
              >
                {userIcon} Iniciar sesión
              </button>
              {welcomeMessage && <WelcomeMessage message={welcomeMessage} />}
            </div>
          </>
        )}
        {showLoginForm && (
          <>
            <h1 className="text-2xl font-semibold mb-2">
              {userIcon} Iniciar sesión
            </h1>
            <form onSubmit={handleLoginSubmit}>
              {/* Correo Electrónico para inicio de sesión */}
              <div className="mb-4 mt-4">
                <label
                  htmlFor="loginEmail"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {envelopeIcon} Correo Electrónico
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  name="loginEmail"
                  placeholder="Email"
                  value={loginFormData.loginEmail}
                  onChange={handleChange}
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                />
                {formErrors.loginEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.loginEmail}
                  </p>
                )}
              </div>
              {/* Contraseña */}
              <div className="mb-4">
                <label
                  htmlFor="loginPassword"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  {lockIcon} Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="loginPassword"
                    name="loginPassword"
                    placeholder="Contraseña"
                    value={loginFormData.loginPassword}
                    onChange={handleChange}
                    className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2"
                  />
                  <button
                    type="button"
                    className="transition-all duration-300 ease-in-out scale-100 hover:scale-105 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                {formErrors.loginPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.loginPassword}
                  </p>
                )}
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 w-full bg-teal-500 text-white rounded px-4 py-2 hover:bg-teal-600 focus:outline-none"
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 flex items-center justify-center w-full h-8 bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded focus:outline-none mt-2"
                >
                  <FaGoogle className="mr-2" />
                  Accede con Google
                </button>
                <Toaster position="top-center" />
              </div>
            </form>
            <div className="mt-2 text-center">
              <h1 className="text-sm text-gray-600 mb-2 mt-2">
                ¿No tienes cuenta?
              </h1>
              <button
                className="transition-all duration-300 ease-in-out transform scale-100 hover:scale-105 bg-teal-800 text-white rounded px-4 py-2 hover:bg-teal-900 focus:outline-none"
                onClick={showRegisterFormView}
              >
                Regístrate
              </button>
            </div>
            {welcomeMessageLogin && (
              <WelcomeMessageLogin message={welcomeMessageLogin} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
