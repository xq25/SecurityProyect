import React, { useState } from "react";

import { AppHeader } from "../components/ui/HeaderGeneric"; 
import { AppSideBar } from "../components/ui/SidebarGeneric";
import { Outlet } from "react-router-dom";
import { useUI } from "../context/UIProvider";

const DefaultLayout = () => {
  // Generamos la variable reactiva para cerrar o abrir el SideBar
  const [sidebarOpen, setSidebarOpen] = useState(true); // Por defecto activamos el sideBar
  const { library } = useUI(); // <- obtenemos la librería actual

  return (
    <div
      className={`h-screen w-full flex flex-col ${
        library === "tailwind" ? "dark:bg-boxdark-2 dark:text-bodydark" : ""
      }`}
    >
      {/* ===== Header ===== */}
      <AppHeader />

      {/* ===== Main layout ===== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ===== Sidebar ===== */}
        <AppSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* ===== Main content ===== */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
