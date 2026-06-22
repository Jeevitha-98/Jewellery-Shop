import React, { useState, useEffect } from "react";
import { useAdmin } from "../../Context/AdminContext";
import API from "../../Services/api";

export default function Orders() {
  const { logActivity } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/orders");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load order history registry from backend:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    const matchString = `${o.vendorName} ${o.supplierName} ${o.product} ${o.status}`.toLowerCase();
    return matchString.includes(searchTerm.toLowerCase());
  });

  const openActionModal = (order, type) => {
    setSelectedOrder(order);
    setModalType(type);
  };

  const closeActionModal = () => {
    setSelectedOrder(null);
    setModalType(null);
  };

  const handleUpdateStatus = async (nextStatus) => {
    if (!selectedOrder) return;

    try {
      await API.put(`/admin/orders/${selectedOrder.id}/status`, {
        status: nextStatus,
      });

      logActivity(
        `Order #${selectedOrder.id} updated to ${nextStatus}`,
        "Orders",
        nextStatus === "Rejected"
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: nextStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update status on server:", err);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: nextStatus } : o
        )
      );
    } finally {
      closeActionModal();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#64748b", fontFamily: "Inter, sans-serif" }}>
        <p style={{ fontSize: "16px", fontWeight: "500" }}>Loading vendor requested product orders...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", fontFamily: "'Inter', -apple-system, sans-serif", width: "100%", boxSizing: "border-box" }}>
      
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>Order Management</h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Monitor cross-channel procurements and resolve vendor requested product fulfillment states.</p>
        </div>

        <div>
          <input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 16px",
              width: "280px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Order ID</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Vendor</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Supplier</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Requested Product</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  let badgeBg = "#fffbeb";
                  let badgeColor = "#b45309";
                  if (order.status === "Approved") { badgeBg = "#e0f2fe"; badgeColor = "#0369a1"; }
                  else if (order.status === "Completed") { badgeBg = "#d1fae5"; badgeColor = "#065f46"; }
                  else if (order.status === "Rejected") { badgeBg = "#fee2e2"; badgeColor = "#b91c1c"; }

                  return (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }}>
                      <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>#{order.id}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: "#334155", fontWeight: "500" }}>{order.vendorName}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: "#475569" }}>{order.supplierName}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: "#0f172a" }}>
                        <div style={{ fontWeight: "600" }}>{order.product}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Batch Volume: {order.quantity} units</div>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "12px", backgroundColor: badgeBg, color: badgeColor }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button onClick={() => openActionModal(order, "view")} style={{ padding: "6px 12px", border: "1px solid #e2e8f0", background: "white", borderRadius: "6px", fontSize: "13px", fontWeight: "500", color: "#475569", cursor: "pointer" }}>View</button>
                          <button onClick={() => openActionModal(order, "update")} style={{ padding: "6px 12px", border: "none", background: "#3b82f6", borderRadius: "6px", fontSize: "13px", fontWeight: "500", color: "white", cursor: "pointer" }}>Modify Status</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "48px", color: "#94a3b8", fontSize: "14px", textAlign: "center" }}>
                    No vendor requested product order pipelines found currently.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalType && selectedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", width: "420px", padding: "28px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", border: "1px solid #f1f5f9", textAlign: "left" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: "0 0 14px 0" }}>
              {modalType === "view" ? "Procurement Invoice Specification" : "Modify Transaction Status"}
            </h3>

            {modalType === "view" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "20px 0", fontSize: "14px" }}>
                <div><span style={{ color: "#64748b" }}>Order Reference ID:</span> <strong>#{selectedOrder.id}</strong></div>
                <div><span style={{ color: "#64748b" }}>Purchasing Vendor:</span> <strong>{selectedOrder.vendorName}</strong></div>
                <div><span style={{ color: "#64748b" }}>Line Supplier Hub:</span> <strong>{selectedOrder.supplierName}</strong></div>
                <div><span style={{ color: "#64748b" }}>Item Name:</span> <strong>{selectedOrder.product}</strong></div>
                <div><span style={{ color: "#64748b" }}>Fulfillment Volume:</span> <strong>{selectedOrder.quantity} units</strong></div>
                <div><span style={{ color: "#64748b" }}>Current Track Status:</span> <strong>{selectedOrder.status}</strong></div>
              </div>
            ) : (
              <div style={{ margin: "20px 0" }}>
                <p style={{ fontSize: "14px", color: "#475569", marginBottom: "14px" }}>
                  Select new workflow tracking status for Order <strong>#{selectedOrder.id}</strong>:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button onClick={() => handleUpdateStatus("Pending")}>Pending</button>
                  <button onClick={() => handleUpdateStatus("Approved")}>Approved</button>
                  <button onClick={() => handleUpdateStatus("Rejected")}>Rejected</button>
                  <button onClick={() => handleUpdateStatus("Completed")}>Completed</button>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                  <button onClick={closeActionModal}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}