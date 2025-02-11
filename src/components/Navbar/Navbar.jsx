"use client";

import { usePathname, useRouter } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faShoppingCart,
  faInfoCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getlogindata, logoutUser } from "@/redux/features/userSlice";
import Image from "next/image";
import Buscador from "../Buscador/Buscador";
import logo from "../../../public/images/ecowood.jpg";

const Navbar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const user = useSelector((state) => state.useReducer.user);
  const [localUser, setLocalUser] = useState(user);

  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    if (count !== cartItemsCount) {
      setCartItemsCount(count);
    }
  }, [cartItems, cartItemsCount]);

  const categories = [
    { name: "Todos", path: "todos" },
    { name: "Utensilios de cocina", path: "utensilios" },
    { name: "Muebles", path: "muebles" },
    { name: "Juguetes", path: "juguetes" },
  ];

  useEffect(() => {
    dispatch(getlogindata());
  }, [dispatch]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    dispatch(logoutUser());
    setLocalUser(null);
    router.push("/Sign-in");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscar productos con:", searchQuery);
    window.location.href = `/SearchPage?query=${searchQuery}`;
  };

  const renderView = () => {
    return (
      <>
        <li
          className={`cursor-pointer ${
            pathname === "/Sobre-nosotros" ? "underline" : ""
          }`}
        >
          <Link href="/Sobre-nosotros" legacyBehavior>
            <p className="text-tertiary flex items-center font-light">
              <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
              <span>Sobre Nosotros</span>
            </p>
          </Link>
        </li>
        {user ? (
          <>
            <li
              className={`cursor-pointer ${
                pathname === "/My-account" ? "underline" : ""
              }`}
            >
              <Link href="/My-account">
                <p className="text-tertiary flex items-center font-light">
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  Mi Cuenta
                </p>
              </Link>
            </li>
            <li className="cursor-pointer" onClick={handleSignOut}>
              <p className="text-tertiary flex items-center font-light">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                Cerrar Sesión
              </p>
            </li>
          </>
        ) : (
          <li
            className={`cursor-pointer ${
              pathname === "/Sign-in" ? "underline" : ""
            }`}
          >
            <Link href="/Sign-in">
              <p className="text-tertiary flex items-center font-light">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                Sign in
              </p>
            </Link>
          </li>
        )}

        <li
          className={`cursor-pointer ${
            pathname === "/Carrito" ? "underline" : ""
          }`}
        >
          <Link href="/Carrito" legacyBehavior>
            <a className="text-tertiary flex items-center">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="bg-red-500 text-white text-xs p-1 rounded-full ml-1">
                {cartItemsCount}
              </span>
            </a>
          </Link>
        </li>
      </>
    );
  };

  return (
    <nav className="flex justify-between items-center fixed z-10 top-0 w-full py-8 px-10 bg-primary text-tertiary h-20">
      <ul className="flex items-center gap-7">
        <li
          className={`font-semibold text-lg ${
            pathname === "/" ? "underline" : ""
          }`}
        >
          <Link href="/" legacyBehavior>
            <a className="text-tertiary flex items-center">
              <Image
                src={logo}
                width={100}
                height={100}
                alt="Logo Wood"
                className="rounded-full"
              />
            </a>
          </Link>
        </li>
        {categories.map((category) => (
          <li
            key={category.path}
            className={
              pathname === `/Products/${category.path}`
                ? "underline text-tertiary font-light"
                : "text-tertiary font-light"
            }
          >
            <Link legacyBehavior href={`/Products/${category.path}`}>
              <a className="hover:border-b-2 border-white">{category.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      {/*  <div className="flex items-center">
        <Buscador handleSearch={(e) => setSearchQuery(e.target.value)} />
        <button
          onClick={handleSearch}
          className="ml-2 p-2 bg-secondary text-primary rounded flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:bg-secondary"
        >
          <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-primary" />
        </button>
      </div> */}

      <ul className="flex items-center gap-3">{renderView()}</ul>
    </nav>
  );
};

export default Navbar;
