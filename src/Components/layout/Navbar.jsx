import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../Context/Inventorycontext";
import { useVendor } from "../../Context/Vendorcontext";
import { useAdmin } from "../../Context/AdminContext";
import profileIconImage from "../../Assests/Profileicon Image.jpg";
import NotificationBell from "./NotificationBell";
import { NotificationContext } from "./NotificationContext";

export default function Navbar({ role = "supplier", toggleSidebar, isOpen }) {
  const navigate = useNavigate();
  
  // Hook directly into your production real-time backend alerts manager context stream
  const { notifications, unreadCount: contextUnread, markAllAsRead } = useContext(NotificationContext);

  const storageRole = (localStorage.getItem("role") || role || "").trim().toLowerCase();
  const isVendor = storageRole === "vendor";
  const isAdmin = storageRole === "admin";

  const supplierContext = (!isVendor && !isAdmin) ? useInventory() : {};
  const vendorContext = isVendor ? useVendor() : {};
  const adminContext = isAdmin ? useAdmin() : {};

  const currentContext = isAdmin ? adminContext : (isVendor ? vendorContext : supplierContext);

  const { profile } = currentContext;

  const goProfile = () => {
    if (isAdmin) navigate("/admin/dashboard/profile");
    else if (isVendor) navigate("/vendor/dashboard/profile");
    else navigate("/supplier/dashboard/profile");
  };

  return (
    <div className="professional-navbar">
      <style>{`
        .professional-navbar {
          height: 70px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        .nav-left-controls-box {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-right-actions-box {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
        }

        .sidebar-toggle-trigger {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .sidebar-toggle-trigger:hover {
          background-color: #f1f5f9;
        }

        /* Profile Meta Badge Layout Structs */
        .user-meta-profile-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 12px;
          transition: background-color 0.2s ease;
          user-select: none;
        }

        .user-meta-profile-badge:hover {
          background-color: #f8fafc;
        }

        .avatar-image-mask {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e2e8f0;
          background-color: #f1f5f9;
        }

        .text-info-block {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .profile-name-string {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .profile-role-string {
          font-size: 11px;
          font-weight: 500;
          color: #64748b;
          margin: 2px 0 0 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .professional-navbar {
            padding: 0 20px;
          }
          .text-info-block {
            display: none;
          }
        }
      `}</style>

      {/* LEFT SECTION CONTROLS AREA */}
      <div className="nav-left-controls-box">
        {toggleSidebar && (
          <button onClick={toggleSidebar} className="sidebar-toggle-trigger" title="Toggle Navigation Menu">
            {isOpen ? "✕" : "☰"}
          </button>
        )}
        <div style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.015em" }}>
          Dashboard Engine Workspace
        </div>
      </div>

      {/* RIGHT SECTION CONTROLS AREA */}
      <div className="nav-right-actions-box">
        
        {/* ✅ CONNECTED REAL-TIME BACKEND NOTIFICATION BELL INTEGRATION */}
        <NotificationBell />

        {/* AUTH USER META CARD DETAIL ACCESS */}
        <div className="user-meta-profile-badge" onClick={goProfile}>
          <img 
            src={profileIconImage} 
            alt="Authenticated User Mask" 
            className="avatar-image-mask" 
            onError={(e) => { e.target.src = "https://unsplash.com"; }}
          />
          <div className="text-info-block">
            <span className="profile-name-string">
              {profile?.business_name || profile?.name || "Loading Context..."}
            </span>
            <span className="profile-role-string">
              {storageRole || "User"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
