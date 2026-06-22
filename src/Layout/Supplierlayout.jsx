import React, { useEffect, useState } from "react"; 
import { useNavigate, Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function SupplierLayout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth <= 1024;
      setIsMobile(mobileCheck);
      if (mobileCheck) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        // REMOVED overflowX: "hidden" from base container so slide out panels stay visible
      }}
    >
      {/* Sidebar now mounts outside the hidden container grid view to maintain layout flow */}
      <Sidebar isOpen={isOpen} />

      {isMobile && isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 190, /* FIXED: Raised lower than sidebar layer to sit behind it */
            transition: "opacity 0.3s"
          }}
        />
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          paddingLeft: isMobile ? "0px" : (isOpen ? "260px" : "0px"), 
          transition: "padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxSizing: "border-box",
          width: "100%",
          overflowX: "hidden" /* FIXED: Confines content panels without breaking sidebar viewports */
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
