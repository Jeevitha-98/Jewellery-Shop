import React, { useEffect, useState } from "react"; 
import { useNavigate, Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

export default function VendorLayout() {
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const normalizedRole = role ? role.trim().toLowerCase() : "";

    if (!token || normalizedRole !== "vendor") {
      localStorage.clear();
      navigate("/login");
    }

    const handleResizeGating = () => {
      if (window.innerWidth <= 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResizeGating);
    return () => window.removeEventListener("resize", handleResizeGating);
  }, [navigate]);

  return (
    <div 
      className="vendor-portal-container"
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
      <style>{`
        .vendor-portal-container div[style*="overflow"] {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        .vendor-portal-container table {
          min-width: 650px !important; 
        }

        .vendor-portal-container div[style*="minWidth: 480px"],
        .vendor-portal-container div[style*="minWidth: 320px"] {
          min-width: 100% !important;
          width: 100% !important;
        }

        @media (max-width: 1024px) {
          .vendor-content-body {
            padding-left: 0px !important;
          }

          /* FIXED LAYER STACK: Locks header components securely on top layer boundaries */
          .professional-navbar {
            z-index: 1000 !important;
            position: relative !important;
          }

          .vendor-portal-container div[style*="display: flex"][style*="flexWrap: wrap"],
          .vendor-portal-container div[style*="display: flex"]:not([style*="flexDirection: column"]):not(.professional-navbar) {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 24px !important;
          }

          .professional-navbar, 
          .vendor-portal-container div[style*="borderBottom"][style*="paddingBottom"] {
            flex-direction: row !important;
            align-items: center !important;
          }

          /* FIXED POPUP MASK LAYER DEPTH SYSTEM */
          aside, [style*="width: 260px"] {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            z-index: 1001 !important; /* Raised higher than the relative header mask */
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            transform: ${isOpen ? "translateX(0)" : "translateX(-100%)"} !important;
          }
        }

        @media (max-width: 640px) {
          .vendor-portal-container .portal-page-outlet-wrapper {
            padding: 24px 16px !important;
          }

          .vendor-portal-container div[style*="display: grid"],
          .vendor-portal-container div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          form div[style*="justifyContent: flex-end"] {
            flex-direction: column !important;
            width: 100% !important;
            gap: 12px !important;
          }
          form button, .header-action-btn {
            width: 100% !important;
          }
        }
      `}</style>

      <Sidebar isOpen={isOpen} role="vendor" />

      <div
        className="vendor-content-body"
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
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} role="vendor" />

        <div 
          className="portal-page-outlet-wrapper" 
          style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", padding: "32px", boxSizing: "border-box" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
