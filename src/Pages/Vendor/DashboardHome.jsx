import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { useVendor } from "../../Context/Vendorcontext"; 

export default function DashboardHome() {
  const { 
    availableProducts, 
    myOrders, 
    pendingRequests, 
    acceptedRequests, 
    activityLogs, 
    loading, 
    refreshVendorData 
  } = useVendor();
  
  const [activeTab, setActiveTab] = useState("available_products"); 

  useEffect(() => {
    if (refreshVendorData) {
      refreshVendorData();
    }
  }, []);

  const safeProducts = availableProducts || [];
  const safeOrders = myOrders || [];
  const safePending = pendingRequests || [];
  const safeAccepted = acceptedRequests || [];
  const safeLogs = activityLogs || [];

  const stats = [
    { 
      id: "available_products", 
      title: "Total Available Products", 
      value: safeProducts.length, 
      accentColor: "#2563eb",
      bgColor: "#eff6ff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    },
    { 
      id: "my_orders", 
      title: "My Orders", 
      value: safeOrders.length, 
      accentColor: "#16a34a",
      bgColor: "#f0fdf4",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      )
    },
    { 
      id: "pending_requests", 
      title: "Pending Requests", 
      value: safePending.length, 
      accentColor: "#ea580c",
      bgColor: "#fff7ed",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    { 
      id: "accepted_requests", 
      title: "Accepted Requests", 
      value: safeAccepted.length, 
      accentColor: "#8b5cf6",
      bgColor: "#f5f3ff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    },
  ];

  const handleClearLogs = () => {
    localStorage.removeItem("vendor_activity_logs");
    window.location.reload();
  };

  const headerWrapperStyle = {
    marginBottom: "32px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "16px",
    textAlign: "left"
  };

  const mainHeadingStyle = {
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.02em"
  };

  const subHeadingStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "400"
  };

  const splitGridContainerStyle = {
    display: "flex",
    gap: "32px",
    width: "100%",
    alignItems: "flex-start",
    boxSizing: "border-box",
    flexWrap: "wrap",
    marginTop: "32px"
  };

  const detailViewContainerStyle = {
    flex: "2",
    minWidth: "480px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "28px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)",
    boxSizing: "border-box"
  };

  const sideActivityContainerStyle = {
    flex: "1",
    minWidth: "320px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "28px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)",
    boxSizing: "border-box"
  };

  const catalogHeadingStyle = {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.01em",
    textAlign: "left",
    display: "block",
    width: "100%"
  };

  const activityHeadingStyle = {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.01em",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box"
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", width: "100%" }}>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
          <div style={{ width: "40px", height: "40px", border: "3px solid #cbd5e1", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={headerWrapperStyle}>
        <h2 style={mainHeadingStyle}>Welcome Back, Vendor</h2>
        <p style={subHeadingStyle}>Here is an analytical breakdown of your products, orders, and logistics.</p>
      </div>

      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {stats.map((s) => {
          const isSelected = activeTab === s.id;
          return (
            <div 
              key={s.id} 
              onClick={() => setActiveTab(s.id)}
              style={{ 
                cursor: "pointer", 
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: isSelected ? `2px solid ${s.accentColor}` : "1px solid #e2e8f0",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: isSelected ? `0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px ${s.accentColor}20` : "0 1px 3px 0 rgba(0,0,0,0.02)",
                transform: isSelected ? "translateY(-4px)" : "translateY(0)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                boxSizing: "border-box"
              }}
              onMouseOver={(e) => {
                if(!isSelected) {
                  e.currentTarget.style.borderColor = s.accentColor + "80";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.04)";
                }
              }}
              onMouseOut={(e) => {
                if(!isSelected) {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0,0,0,0.02)";
                }
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                  {s.title}
                </span>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.1" }}>
                  {s.value}
                </span>
              </div>
              <div style={{ backgroundColor: s.bgColor, padding: "12px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", color: s.accentColor }}>
                {s.icon}
              </div>
            </div>
          );
        })}
      </div>

      <div style={splitGridContainerStyle}>
        <div style={detailViewContainerStyle}>
          <h3 style={catalogHeadingStyle}>
            {activeTab === "available_products" && "Available Products Catalogue"}
            {activeTab === "my_orders" && "Vendor Fulfilled Orders Ledger"}
            {activeTab === "pending_requests" && "Pending Procurement Approvals"}
            {activeTab === "accepted_requests" && "Accepted Inbound Requests"}
          </h3>
          
          <div style={{ color: "#64748b", fontSize: "14px", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            No active data rows matching selection found.
          </div>
        </div>

        <div style={sideActivityContainerStyle}>
          <div style={activityHeadingStyle}>
            <span>Recent Activity Logs</span>
            <button 
              onClick={handleClearLogs}
              style={{
                background: "transparent",
                border: "none",
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Clear Logs
            </button>
          </div>
          
          <div style={{ textAlign: "left" }}>
            {safeLogs.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center", marginTop: "32px" }}>No recent activity logged.</p>
            ) : (
              safeLogs.map((log, index) => (
                <div key={index} style={{ padding: "12px 0", borderBottom: index !== safeLogs.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "500", color: "#334155" }}>{log.message || log.text}</p>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{log.timestamp || log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageContainer> 
  );
}

