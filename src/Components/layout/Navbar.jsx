import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../Context/Inventorycontext";
import { useVendor } from "../../Context/Vendorcontext"; 
import profileIconImage from "../../Assests/Profileicon Image.jpg"; 

export default function Navbar({ role = "supplier" }) {
  const navigate = useNavigate();
  const isVendor = role.toLowerCase() === "vendor";
  
  const supplierContext = !isVendor ? useInventory() : {};
  const vendorContext = isVendor ? useVendor() : {};
  
  const currentContext = isVendor ? vendorContext : supplierContext;
  const { profile, activityLogs, systemActivities, pendingRequests, vendorRequests } = currentContext;
  
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
    if (isVendor) {
      navigate("/vendor/dashboard/profile");
    } else {
      navigate("/supplier/dashboard/profile");
    }
  };

  const getRecentActivities = () => {
    const list = [];
    const logs = isVendor ? activityLogs : systemActivities;
    const requests = isVendor ? pendingRequests : vendorRequests;
    
    if (logs && logs.length > 0) {
      logs.forEach((act, index) => {
        if (act) {
          list.push({
            id: act.id || `log-${index}`,
            text: act.text || act.message,
            time: act.time || act.timestamp || "Just now",
            urgent: act.urgent || false
          });
        }
      });
    }
    
    if (requests && requests.length > 0) {
      requests.forEach((req, index) => {
        if (req) {
          const isPending = req.status?.toLowerCase() === "pending";
          if (!list.some(item => item.id === (req.id || `req-${index}`))) {
            list.push({
              id: req.id || `req-${index}`,
              text: isVendor
                ? (isPending ? `Your inbound product request for ${req.product} is pending review.` : `Product request update: '${req.status}'.`)
                : (isPending ? `New order request from ${req.vendorName} for ${req.quantity} units of ${req.product}.` : `Order status for ${req.product} updated to '${req.status}'.`),
              time: isPending ? "Action required" : "Completed",
              urgent: isPending
            });
          }
        }
      });
    }
    
    return list.slice(0, 4);
  };

  const recentActivities = getRecentActivities();
  const unreadCount = recentActivities.filter(a => a.urgent).length;

  const containerStyle = {
    height: "64px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    boxSizing: "border-box",
    width: "100%",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    zIndex: 40,
  };

  const actionGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const notificationWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const iconContainerStyle = {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: showNotifications ? "#f1f5f9" : "transparent",
    transition: "background-color 0.2s ease",
    border: "none",
    outline: "none"
  };

  const notificationDotStyle = {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "8px",
    height: "8px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
    border: "2px solid #ffffff",
  };

  const userMetaDataStyle = {
    display: "flex",
    flexDirection: "column",
    textAlign: "right",
    lineHeight: "1.4",
  };

  const businessNameStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  };

  const userIdStyle = {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    margin: 0,
  };

  const profileBadgeStyle = {
    cursor: "pointer",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #e2e8f0",
    boxSizing: "border-box",
    transition: "all 0.2s ease-in-out",
    objectFit: "cover",
    backgroundColor: "#f8fafc",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "52px",
    right: "0",
    width: "320px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    display: showNotifications ? "block" : "none",
  };

  const dropdownHeaderStyle = {
    padding: "14px 16px",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={actionGroupStyle}>
        
        <div style={notificationWrapperStyle} ref={notificationRef}>
          <button 
            style={iconContainerStyle}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Recent Activities"
            onMouseOver={(e) => { if(!showNotifications) e.currentTarget.style.backgroundColor = "#f1f5f9"; }}
            onMouseOut={(e) => { if(!showNotifications) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={showNotifications ? "#1e293b" : "#64748b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {unreadCount > 0 && <span style={notificationDotStyle} />}
          </button>

          <div style={dropdownStyle}>
            <div style={dropdownHeaderStyle}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>Recent Activities</span>
              {unreadCount > 0 && (
                <span style={{ fontSize: "11px", backgroundColor: "#fee2e2", color: "#ef4444", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
                  {unreadCount} Alert{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div style={{ maxHeight: "280px", overflowY: "auto" }}>
              {recentActivities.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                  No recent activities recorded.
                </div>
              ) : (
                recentActivities.map((activity) => activity && (
                  <div 
                    key={activity.id} 
                    style={{ 
                      padding: "12px 16px", 
                      borderBottom: "1px solid #f1f5f9", 
                      backgroundColor: activity.urgent ? "#fff5f5" : "#ffffff",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      textAlign: "left"
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "12px", color: "#334155", lineHeight: "1.45", fontWeight: activity.urgent ? "500" : "400" }}>
                      {activity.text}
                    </p>
                    <span style={{ fontSize: "10px", color: activity.urgent ? "#dc2626" : "#94a3b8", fontWeight: "600" }}>
                      {activity.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={userMetaDataStyle}>
          <h4 style={businessNameStyle}>
            {profile?.business_name || (isVendor ? "Vendor Enterprise" : "Supplier Warehouse")}
          </h4>
          <p style={userIdStyle}>
            {profile?.user_id || localStorage.getItem("user_id") || (isVendor ? "VEN001" : "SUP001")}
          </p>
        </div>

        <img 
          src={profileIconImage} 
          alt="Profile Badge" 
          style={profileBadgeStyle}
          onClick={goProfile}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#2563eb"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
        />

      </div>
    </div>
  );
}
