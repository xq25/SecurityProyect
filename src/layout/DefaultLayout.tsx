import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { AppHeader } from "../components/ui/HeaderGeneric"; 
import { AppSideBar } from "../components/ui/SidebarGeneric";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Si la pantalla es grande, mantenlo abierto; si no, ciérralo.
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  return (
    <div>
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <AppSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Ajuste del margen dinámico según si el sidebar está visible */}
        <main
          className={`flex-1 overflow-y-auto p-4 md:p-6 2xl:p-10 transition-all duration-300 ${
            sidebarOpen && isLargeScreen ? "ml-[260px]" : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
