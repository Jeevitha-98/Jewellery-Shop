import React, { useEffect, useState } from "react"; 
import { useNavigate, Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function SupplierLayout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "supplier") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div 
      style={{ 
        display: "flex", 
        minHeight: "100vh", 
        backgroundColor: "#f8fafc",
        position: "relative",
        boxSizing: "border-box",
        width: "100%",
        overflowX: "hidden"
      }}
    >
      <Sidebar isOpen={isOpen} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingLeft: isOpen ? "240px" : "0px", 
          transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxSizing: "border-box",
          width: "100%"
        }}
      >
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
