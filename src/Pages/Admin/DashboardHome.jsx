import React, { useState, useEffect } from "react";
import { useAdmin } from "../../Context/AdminContext";
import API from "../../Services/api";

export default function DashboardHome() {
  const { metrics, products, adminNotifications, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState("suppliers");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [suppliersList, setSuppliersList] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);

  useEffect(() => {
    const fetchGridData = async () => {
      try {
        setOrdersLoading(true);
        const [ordersRes, suppliersRes, vendorsRes] = await Promise.all([
          API.get("/admin/orders").catch(() => ({ data: [] })),
          API.get("/admin/suppliers").catch(() => ({ data: [] })),
          API.get("/admin/vendors").catch(() => ({ data: [] }))
        ]);

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setSuppliersList(Array.isArray(suppliersRes.data) ? suppliersRes.data : []);
        setVendorsList(Array.isArray(vendorsRes.data) ? vendorsRes.data : []);
      } catch (err) {
        console.error("Failed to load tracking analytics lists:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchGridData();
  }, []);

  const totalStock =
    products?.reduce((sum, item) => {
      return sum + parseInt(item.stock || item.quantity || 0, 10);
    }, 0) || 0;

  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#64748b", fontFamily: "Inter, sans-serif" }}>
        <p style={{ fontSize: "16px", fontWeight: "500" }}>
          Loading admin metrics data matrix...
        </p>
      </div>
    );
  }

  const summaryCards = [
    {
      id: "suppliers",
      title: "Total Suppliers",
      value: metrics?.totalSuppliers || 0,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      bgColor: "#eff6ff",
      activeBorder: "#3b82f6",
    },
    {
      id: "vendors",
      title: "Total Vendors",
      value: metrics?.totalVendors || 0,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      bgColor: "#ecfdf5",
      activeBorder: "#10b981",
    },
    {
      id: "products",
      title: "Total Products",
      value: metrics?.totalProducts || 0,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 22"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
      bgColor: "#f5f3ff",
      activeBorder: "#8b5cf6",
    },
    {
      id: "orders",
      title: "Pending Orders",
      value: metrics?.pendingRequests || 0,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      bgColor: "#fffbeb",
      activeBorder: "#f59e0b",
    },
    {
      id: "stock",
      title: "Total Stock",
      value: totalStock,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="10" x2="3" y2="10"></line>
          <path d="M21 6H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"></path>
        </svg>
      ),
      bgColor: "#fdf2f8",
      activeBorder: "#ec4899",
    },
  ];

  return (
    <div style={{ padding: "32px", fontFamily: "'Inter', -apple-system, sans-serif", width: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "28px", textAlign: "left" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>
          Workspace Overview
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Monitor operational flow analytics, supply lines, and global catalog parameters.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {summaryCards.map((card) => {
          const isSelected = activeTab === card.id;

          return (
            <div
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                padding: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(15, 23, 42, 0.05)"
                  : "0 1px 3px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.04)",
                border: isSelected
                  ? `2px solid ${card.activeBorder}`
                  : "2px solid #f1f5f9",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isSelected ? "translateY(-2px)" : "none",
                boxSizing: "border-box",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#64748b" }}>
                  {card.title}
                </span>
                <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#0f172a", margin: "8px 0 0 0" }}>
                  {card.value}
                </h2>
              </div>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  backgroundColor: card.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "24px" }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", padding: "24px", border: "1px solid #f1f5f9", boxSizing: "border-box" }}>
          <div style={{ marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", textAlign: "left" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: 0, textTransform: "capitalize" }}>
              Active {activeTab === "stock" ? "Total Stock" : activeTab} Feed
            </h3>
          </div>

          <div style={{ overflowX: "auto", width: "100%" }}>
            {activeTab === "suppliers" && (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ color: "#475569", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Supplier ID</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Business Name</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliersList && suppliersList.length > 0 ? (
                    suppliersList.slice(0, 6).map((s) => (
                      <tr key={s.user_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px", fontWeight: "700", color: "#0f172a" }}>{s.user_id}</td>
                        <td style={{ padding: "14px" }}>{s.business_name}</td>
                        <td style={{ padding: "14px", color: "#64748b" }}>{s.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
                        No active suppliers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "vendors" && (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ color: "#475569", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Vendor ID</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Business Name</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorsList && vendorsList.length > 0 ? (
                    vendorsList.slice(0, 6).map((v) => (
                      <tr key={v.user_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px", fontWeight: "700", color: "#0f172a" }}>{v.user_id}</td>
                        <td style={{ padding: "14px" }}>{v.business_name}</td>
                        <td style={{ padding: "14px", color: "#64748b" }}>{v.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
                        No active vendors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "products" && (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ color: "#475569", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Product Name</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Category</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.slice(0, 6).map((p) => (
                      <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px", fontWeight: "600" }}>{p.name}</td>
                        <td style={{ padding: "14px" }}>
                          <span style={{ background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", fontSize: "12px", color: "#475569" }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: "14px", fontWeight: "700", color: "#0f172a" }}>
                          ₹{Number(p.price).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
                        No system inventory products cataloged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "orders" && (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ color: "#475569", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Order ID</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Vendor Client</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Product Request</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan="4" style={{ padding: "24px", color: "#64748b", textAlign: "center" }}>
                        Fetching pipeline state...
                      </td>
                    </tr>
                  ) : orders && orders.length > 0 ? (
                    orders.slice(0, 6).map((o) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "14px", fontWeight: "700", color: "#0f172a" }}>#{o.id}</td>
                        <td style={{ padding: "14px" }}>{o.vendorName}</td>
                        <td style={{ padding: "14px", fontWeight: "500" }}>{o.product}</td>
                        <td style={{ padding: "14px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "4px 10px",
                              borderRadius: "20px",
                              display: "inline-block",
                              backgroundColor:
                                o.status === "Pending"
                                  ? "#fffbeb"
                                  : o.status === "Approved"
                                  ? "#e0f2fe"
                                  : o.status === "Completed"
                                  ? "#d1fae5"
                                  : "#fee2e2",
                              color:
                                o.status === "Pending"
                                  ? "#b45309"
                                  : o.status === "Approved"
                                  ? "#0369a1"
                                  : o.status === "Completed"
                                  ? "#065f46"
                                  : "#b91c1c",
                            }}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
                        No active requests found inside system tables.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "stock" && (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                <thead>
                  <tr style={{ color: "#475569", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Item Designation</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Origin Hub ID</th>
                    <th style={{ padding: "12px 14px", fontWeight: "600" }}>Stock Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.slice(0, 6).map((p) => {
                      const stockVal = parseInt(p.stock || p.quantity || 0, 10);
                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "14px", fontWeight: "600" }}>{p.name}</td>
                          <td style={{ padding: "14px", color: "#64748b" }}>
                            {p.supplier_id || "Global Hub"}
                          </td>
                          <td style={{ padding: "14px", color: stockVal === 0 ? "#ef4444" : "#0f172a", fontWeight: "700" }}>
                            {stockVal === 0 ? "Out of Stock" : `${stockVal} units`}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
                        No catalog items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "14px",
            padding: "24px",
            border: "1px solid #f1f5f9",
            textAlign: "left",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", margin: 0 }}>
              Recent Activity
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "420px", overflowY: "auto" }}>
            {adminNotifications && adminNotifications.length > 0 ? (
              adminNotifications.map((activity) => (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "14px",
                    borderRadius: "12px",
                    backgroundColor: "#f8fafc",
                    borderLeft: activity.urgent ? "4px solid #ef4444" : "4px solid #3b82f6",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13.5px", color: "#1e293b", margin: "0 0 6px 0", lineHeight: "1.5" }}>
                      {activity.text}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          padding: "2px 6px",
                          borderRadius: "6px",
                          backgroundColor: activity.urgent ? "#fee2e2" : "#e0f2fe",
                          color: activity.urgent ? "#ef4444" : "#0369a1",
                        }}
                      >
                        {activity.badge || "System"}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "40px 20px", color: "#94a3b8", fontSize: "13px", textAlign: "center", fontWeight: "500" }}>
                No administrative operation activities logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}