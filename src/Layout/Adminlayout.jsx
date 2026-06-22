import React, { useEffect, useState } from "react"; 
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { useAdmin } from "../Context/AdminContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { profile } = useAdmin();
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

    if (!token || role?.toLowerCase() !== "admin") {
      localStorage.clear();
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
      }}
    >
      <Sidebar isOpen={isOpen} role="admin" />

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
            zIndex: 190, 
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
          overflowX: "hidden" 
        }}
      >
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} role="admin" adminData={profile} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
