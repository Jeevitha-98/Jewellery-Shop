import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { useVendor } from "../../Context/Vendorcontext"; 

export default function MyOrders() {
  const { pendingRequests, acceptedRequests, availableProducts, refreshVendorData, loading } = useVendor();
  
  const [statusFilter, setStatusFilter] = useState("All"); 

  useEffect(() => {
    if (refreshVendorData) {
      refreshVendorData();
    }
  }, []);

  const getUnifiedOrdersList = () => {
    const pendingList = (pendingRequests || []).map(r => ({ ...r, status: "Pending" }));
    const acceptedList = (acceptedRequests || []).map(r => ({ ...r, status: "Approved" }));
    return [...pendingList, ...acceptedList];
  };

  const allOrders = getUnifiedOrdersList();

  const filteredOrders = allOrders.filter((order) => {
    if (!order) return false;
    if (statusFilter === "All") return true;
    return order.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusStyle = (statusText) => {
    switch (statusText) {
      case "Approved":
        return { background: "#e6f4ea", color: "#137333" };
      case "Rejected":
        return { background: "#fee2e2", color: "#c5221f" };
      default:
        return { background: "#fff7ed", color: "#b06000" };
    }
  };

  const headerWrapperStyle = {
    fontFamily: "'Inter', sans-serif",
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

  const tableContainerStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "8px"
  };

  const tableTitleBarStyle = {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px"
  };

  const segmentConsoleStyle = {
    display: "flex",
    backgroundColor: "#f1f5f9",
    padding: "4px",
    borderRadius: "8px",
    gap: "2px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif"
  };

  const thStyle = {
    padding: "18px 24px",
    background: "#f8fafc",
    color: "#475569",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #e2e8f0",
  };

  const tdStyle = {
    padding: "18px 24px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", width: "100%" }}>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ width: "40px", height: "40px", border: "3px solid #cbd5e1", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={headerWrapperStyle}>
        <h2 style={mainHeadingStyle}>My Orders</h2>
        <p style={subHeadingStyle}>Track outbound product requests, logistics status metrics, and supply line validations.</p>
      </div>

      <div style={tableContainerStyle}>
        <div style={tableTitleBarStyle}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
            Order Management Queue
          </span>
          
          <div style={segmentConsoleStyle}>
            {["All", "Pending", "Approved", "Rejected"].map((tab) => {
              const isSelected = statusFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    border: "none",
                    outline: "none",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    backgroundColor: isSelected ? "#ffffff" : "transparent",
                    color: isSelected ? "#2563eb" : "#475569",
                    boxShadow: isSelected ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" : "none",
                    transition: "all 0.15s ease-in-out"
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Requested Products</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Supplier Name</th>
                <th style={thStyle}>Requested Date</th>
                <th style={thStyle}>Request Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders && filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => {
                  if (!order) return null;

                  const matchedProduct = (availableProducts || []).find(
                    (p) => p.name?.toLowerCase() === order.product?.toLowerCase()
                  );
                  
                  const resolvedImage = order.product_image || order.image || order.image_url || matchedProduct?.image || matchedProduct?.image_url;

                  return (
                    <tr
                      key={order.id || i}
                      style={{ transition: "background-color 0.2s ease" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          {resolvedImage ? (
                            <img 
                              src={resolvedImage} 
                              alt={order.product} 
                              style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e2e8f0" }} 
                            />
                          ) : (
                            <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "11px", fontWeight: "500" }}>
                              No Img
                            </div>
                          )}
                          <span style={{ fontWeight: "600", color: "#0f172a" }}>{order.product}</span>
                        </div>
                      </td>
                      <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", fontWeight: "600", color: "#0f172a" }}>{order.quantity} units</td>
                      <td style={{ ...tdStyle, color: "#475569", fontWeight: "500" }}>{order.supplier_name || order.supplier_id || "Global Wholesaler"}</td>
                      <td style={{ ...tdStyle, color: "#64748b" }}>
                        {order.requested_date || new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "12px",
                            display: "inline-block",
                            letterSpacing: "0.02em",
                            ...getStatusStyle(order.status)
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: "center", padding: "48px 24px", color: "#64748b" }}>
                    No procurement records matching selection found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
