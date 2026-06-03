import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../Context/Inventorycontext";
import { useVendor } from "../../Context/Vendorcontext";
import { useAdmin } from "../../Context/AdminContext";
import profileIconImage from "../../Assests/Profileicon Image.jpg";
import NotificationBell from "./NotificationBell";
// ✅ FIXED RELATIVE IMPORT PATH: Points directly to the layout directory to resolve Vite compilation errors
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

  const {
    profile,
    activityLogs,
    systemActivities,
    pendingRequests,
    vendorRequests,
    adminNotifications
  } = currentContext;

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goProfile = () => {
    if (isAdmin) navigate("/admin/dashboard/profile");
    else if (isVendor) navigate("/vendor/dashboard/profile");
    else navigate("/supplier/dashboard/profile");
  };

  const getRecentActivities = () => {
    // Priority 1: Map your active backend live context polling notifications array if populated
    if (notifications && notifications.length > 0) {
      return notifications.slice(0, 4).map(n => ({
        id: n.id,
        text: n.message || n.text || "System operation notification log row",
        time: n.time || "Just now",
        urgent: n.unread
      }));
    }

    const list = [];
    if (isAdmin) {
      (adminNotifications || []).forEach((act, index) => {
        list.push({
          id: act.id || `admin-log-${index}`,
          text: act.text || act.message || "System log alert updated",
          time: act.time || "Just now",
          urgent: act.urgent || act.status === "pending"
        });
      });
      return list.slice(0, 4);
    }

    const logs = isVendor ? activityLogs : systemActivities;
    const requests = isVendor ? pendingRequests : vendorRequests;

    (logs || []).forEach((act, index) => {
      list.push({
        id: act.id || `log-${index}`,
        text: act.text || act.message,
        time: act.time || "Just now",
        urgent: act.urgent || false
      });
    });

    (requests || []).forEach((req, index) => {
      const isPending = req.status?.toLowerCase() === "pending";
      list.push({
        id: req.id || `req-${index}`,
        text: isVendor
          ? isPending
            ? `Your product request for ${req.product} is pending.`
            : `Request updated: ${req.status}`
          : isPending
            ? `New order from ${req.vendorName} for ${req.product}`
            : `Order ${req.product} updated to ${req.status}`,
        time: isPending ? "Action required" : "Completed",
        urgent: isPending
      });
    });

    return list.slice(0, 4);
  };

  const recentActivities = getRecentActivities();
  const unreadCount = contextUnread !== undefined ? contextUnread : recentActivities.filter(a => a.urgent).length;
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

        .nav-action-btn {
          background: transparent;
          border: 1px solid #f1f5f9;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: #64748b;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }

        .nav-action-btn:hover {
          background-color: #f8fafc;
          border-color: #e2e8f0;
          color: #0f172a;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .nav-action-btn:active {
          transform: translateY(0);
        }

        .notification-dot {
          width: 9px;
          height: 9px;
          background-color: #ef4444;
          border-radius: 50%;
          position: absolute;
          top: 8px;
          right: 8px;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }

        .notification-dropdown {
          position: absolute;
          right: 0;
          top: 54px;
          width: 350px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
          overflow: hidden;
          transform-origin: top right;
          animation: navDropdownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes navDropdownFade {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .dropdown-header {
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          background-color: #f8fafc;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
        }

        .dropdown-badge {
          background-color: #f1f5f9;
          color: #475569;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: -0.01em;
          border: 1px solid #e2e8f0;
        }

        .activity-scroll-area {
          max-height: 320px;
          overflow-y: auto;
        }

        .activity-scroll-area::-webkit-scrollbar {
          width: 5px;
        }

        .activity-scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .activity-scroll-area::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .activity-row {
          padding: 14px 20px;
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .activity-row:last-child {
          border-bottom: none;
        }

        .activity-row:hover {
          background-color: #f8fafc;
        }

        .activity-text {
          font-size: 13px;
          color: #334155;
          margin: 0;
          line-height: 1.5;
        }

        .activity-time-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2px;
        }

        .activity-time {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 500;
        }

        .activity-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          padding: 6px 14px 6px 8px;
          border-radius: 14px;
          border: 1px solid transparent;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .profile-trigger:hover {
          background-color: #f1f5f9;
          border-color: #e2e8f0;
        }

        .nav-avatar-img {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
        }

        .meta-user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .meta-username {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
        }

        .meta-role-tag {
          font-size: 11px;
          color: #64748b;
          margin: 2px 0 0 0;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
      `}</style>
      
      <div className="nav-left-controls-box">
        <button className="nav-action-btn" onClick={toggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      <div className="nav-right-actions-box" ref={notificationRef}>
        <button className="nav-action-btn" onClick={() => {
          setShowNotifications(!showNotifications);
          if (!showNotifications) markAllAsRead();
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && <span className="notification-dot" />}
        </button>

        {showNotifications && (
          <div className="notification-dropdown">
            <div className="dropdown-header">
              <span>Activity Alerts Stream</span>
              {unreadCount > 0 && <span className="dropdown-badge">{unreadCount} New</span>}
            </div>
            <div className="activity-scroll-area">
              {recentActivities.map((act) => (
                <div key={act.id} className="activity-row">
                  <p className="activity-text">{act.text}</p>
                  <div className="activity-time-wrapper">
                    <span className="activity-time">{act.time}</span>
                    <span className="activity-status-dot" style={{ backgroundColor: act.urgent ? '#ef4444' : '#e2e8f0' }} />
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="activity-row" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                  Zero operational alerts logged.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="profile-trigger" onClick={goProfile}>
          <img className="nav-avatar-img" src={profileIconImage} alt="User Avatar" onError={(e) => { e.target.src = "https://unsplash.com" }} />
          <div className="meta-user-details">
            <p className="meta-username">{profile?.business_name || profile?.name || "Workspace Partner"}</p>
            <p className="meta-role-tag">{storageRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
