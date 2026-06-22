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
    if (refreshVendorData) refreshVendorData();
  }, []);

  const safeProducts = availableProducts || [];
  const safeOrders = myOrders || [];
  const safePending = pendingRequests || [];
  const safeAccepted = acceptedRequests || [];
  const safeLogs = activityLogs || [];

  const stats = [
    {
      id: "available_products",
      title: "Products",
      value: safeProducts.length,
      accentColor: "#2563eb",
      bgColor: "#eff6ff",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      )
    },
    {
      id: "my_orders",
      title: "Orders",
      value: safeOrders.length,
      accentColor: "#16a34a",
      bgColor: "#f0fdf4",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      )
    },
    {
      id: "pending_requests",
      title: "Pending",
      value: safePending.length,
      accentColor: "#ea580c",
      bgColor: "#fff7ed",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      id: "accepted_requests",
      title: "Accepted",
      value: safeAccepted.length,
      accentColor: "#8b5cf6",
      bgColor: "#f5f3ff",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

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

  const itemCardStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
    marginBottom: "12px"
  };

  const imgStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc"
  };

  const renderContent = () => {
    const empty = (msg) => (
      <div
        style={{
          padding: "48px 24px",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "14px"
        }}
      >
        {msg}
      </div>
    );

    switch (activeTab) {
      case "available_products":
        return safeProducts.length === 0 ? (
          empty("No products logged in catalog database.")
        ) : (
          <div>
            <h3 style={catalogHeadingStyle}>📦 Marketplace Catalog</h3>

            {safeProducts.map((p, i) => (
              <div key={i} style={itemCardStyle}>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={p.image || "https://via.placeholder.com/100"}
                    style={imgStyle}
                    alt={p.name}
                  />

                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#0f172a",
                        fontSize: "14px"
                      }}
                    >
                      {p.name}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px"
                      }}
                    >
                      Category: {p.category || "General"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    color: "#2563eb",
                    fontSize: "15px"
                  }}
                >
                  ₹{p.price}
                </div>
              </div>
            ))}
          </div>
        );

      case "my_orders":
        return safeOrders.length === 0 ? (
          empty("No orders found recorded.")
        ) : (
          <div>
            <h3 style={catalogHeadingStyle}>🛒 Order Transactions</h3>

            {safeOrders.map((o, i) => (
              <div key={i} style={itemCardStyle}>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={o.image || "https://via.placeholder.com/100"}
                    style={imgStyle}
                    alt={o.product}
                  />

                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#0f172a",
                        fontSize: "14px"
                      }}
                    >
                      {o.product}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px"
                      }}
                    >
                      Qty: {o.quantity}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "#e6f4ea",
                    color: "#137333",
                    border: "1px solid #c4eed0"
                  }}
                >
                  {o.status || "Approved"}
                </span>
              </div>
            ))}
          </div>
        );

      case "pending_requests":
        return safePending.length === 0 ? (
          empty("No pending requests")
        ) : (
          <div>
            <h3 style={catalogHeadingStyle}>⏳ Awaiting Fulfillment</h3>

            {safePending.map((r, i) => (
              <div key={i} style={itemCardStyle}>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={r.image || "https://via.placeholder.com/100"}
                    style={imgStyle}
                    alt={r.product}
                  />

                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#0f172a",
                        fontSize: "14px"
                      }}
                    >
                      {r.product}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px"
                      }}
                    >
                      Qty: {r.quantity}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "#fff7ed",
                    color: "#c2410c",
                    border: "1px solid #fcd34d"
                  }}
                >
                  Pending
                </span>
              </div>
            ))}
          </div>
        );

      case "accepted_requests":
        return safeAccepted.length === 0 ? (
          empty("No accepted requests recorded.")
        ) : (
          <div>
            <h3 style={catalogHeadingStyle}>✅ Dispatched & Settled</h3>

            {safeAccepted.map((r, i) => (
              <div key={i} style={itemCardStyle}>
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={r.image || "https://via.placeholder.com/100"}
                    style={imgStyle}
                    alt={r.product}
                  />

                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#0f172a",
                        fontSize: "14px"
                      }}
                    >
                      {r.product}
                    </div>

                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px"
                      }}
                    >
                      Supplier: {r.supplier_name || "N/A"}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "#f3e8ff",
                    color: "#6b21a8",
                    border: "1px solid #e9d5ff"
                  }}
                >
                  Accepted
                </span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "40vh",
          width: "100%"
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #cbd5e1",
            borderTop: "3px solid #2563eb",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}
        />
      </div>
    );
  }

  return (
    <PageContainer>
      <div style={headerWrapperStyle}>
        <h1 style={mainHeadingStyle}>Vendor Dashboard</h1>

        <p style={subHeadingStyle}>
          Manage inventory, requests, and supplier orders efficiently.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
          width: "100%",
          boxSizing: "border-box"
        }}
      >
        {stats.map((s) => {
          const isSelected = activeTab === s.id;

          return (
            <div
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              style={{
                padding: "24px",
                borderRadius: "16px",
                cursor: "pointer",
                backgroundColor: "#ffffff",
                border: isSelected
                  ? `2px solid ${s.accentColor}`
                  : "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: isSelected
                  ? `0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px ${s.accentColor}20`
                  : "0 1px 3px 0 rgba(0,0,0,0.02)",
                transform: isSelected
                  ? "translateY(-4px)"
                  : "translateY(0)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                boxSizing: "border-box"
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor =
                    s.accentColor + "80";
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.04)";
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 1px 3px 0 rgba(0,0,0,0.02)";
                }
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: "6px"
                  }}
                >
                  {s.title}
                </span>

                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#0f172a",
                    lineHeight: "1.1"
                  }}
                >
                  {s.value}
                </span>
              </div>

              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: s.bgColor,
                  color: s.accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {s.icon}
              </div>
            </div>
          );
        })}
      </div>

      <div style={splitGridContainerStyle}>
        <div style={detailViewContainerStyle}>
          {renderContent()}
        </div>

        <div style={sideActivityContainerStyle}>
          <div style={activityHeadingStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              ⚡ Recent Activity
            </div>

            {safeLogs.length > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem("vendor_activity_logs");
                  window.location.reload();
                }}
                style={{
                  fontSize: "11px",
                  border: "none",
                  background: "transparent",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            {safeLogs.length === 0 ? (
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  padding: "20px 0",
                  textAlign: "center"
                }}
              >
                No active session activity logs found.
              </div>
            ) : (
              safeLogs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    backgroundColor: log?.urgent
                      ? "#fff2f2"
                      : "#f8fafc",
                    border: log?.urgent
                      ? "1px solid #fecaca"
                      : "1px solid #e2e8f0",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#1e293b",
                      lineHeight: "1.45",
                      fontWeight: "500"
                    }}
                  >
                    {log?.text ||
                      log ||
                      "Activity event recorded."}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "2px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        backgroundColor: log?.urgent
                          ? "#ef4444"
                          : "#2563eb",
                        color: "#ffffff"
                      }}
                    >
                      {log?.badge || "System"}
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        fontFamily: "monospace"
                      }}
                    >
                      {log?.time || "Just now"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}