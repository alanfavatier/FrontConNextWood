"use client";
import { useAppSelector } from "../../redux/hooks";
import React, { useDispatch } from "react";
import VendedorPage from "../../components/Dashboard/VendedorPage";
import AdminPage from "../../components/Dashboard/AdminPage";

const Page = () => {
  const user = useAppSelector((state) => state.useReducer.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getlogindata());
  }, [dispatch]);

  // Decide qué componente renderizar basado en el rol del usuario
  const SelectedPage = user?.role === "Admin" ? AdminPage : VendedorPage;

  return (
    <div>
      <SelectedPage />
    </div>
  );
};

export default Page;
