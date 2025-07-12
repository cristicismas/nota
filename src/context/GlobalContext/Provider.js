"use client";
import { useState } from "react";
import { GlobalContext } from "./Context";

const GlobalProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (sidebarOpen) {
      document.body.style.setProperty("--sidebar-width", "80px");
      setSidebarOpen(false);
    } else {
      document.body.style.setProperty("--sidebar-width", "350px");
      setSidebarOpen(true);
    }

    setSidebarOpen(!sidebarOpen);
  };

  return (
    <GlobalContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
