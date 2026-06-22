import React from 'react';

export default function OrderTable({ orders, renderActions }) {
  
  const getStatusStyle = (status) => {
    switch(status) {
      case 'Pending': return { backgroundColor: "#fffbeb", color: "#b45309", border: "1px solid #fde68a" };
      case 'Approved': 
      case 'Accepted': return { backgroundColor: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0" };
      case 'Rejected': return { backgroundColor: "#fdf2f2", color: "#b91c1c", border: "1px solid #fca5a5" };
      case 'Processing': return { backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" };
      case 'Completed': return { backgroundColor: "#f8fafc", color: "#475569", border: "1px solid #cbd5e1" };
      default: return { backgroundColor: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" };
    }
  };

  return (
    <div style={{ width: "100%", overflowX: "auto", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textLeft: "left", fontSize: "14px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", textTransform: "uppercase", fontSize: "12px", fontWeight: "600" }}>
            <th style={{ padding: "14px 20px", textAlign: "left" }}>Order ID</th>
            <th style={{ padding: "14px 20px", textAlign: "left" }}>Vendor</th>
            <th style={{ padding: "14px 20px", textAlign: "left" }}>Supplier</th>
            <th style={{ padding: "14px 20px", textAlign: "left" }}>Product Name</th>
            <th style={{ padding: "14px 20px", textAlign: "left" }}>Quantity</th>
            <th style={{ padding: "14px 20px", textAlign: "left" }}>Order Status</th>
            <th style={{ padding: "14px 20px", textAlign: "left" }}>Requested Date</th>
            <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody style={{ color: "#334155" }}>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontWeight: "500" }}>
                No orders found matching this filter criteria.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 20px", fontWeight: "700", color: "#2563eb" }}>#{order.id}</td>
                <td style={{ padding: "14px 20px", fontWeight: "600" }}>{order.vendor_name}</td>
                <td style={{ padding: "14px 20px", color: "#64748b" }}>{order.supplier_name}</td>
                <td style={{ padding: "14px 20px", fontWeight: "500" }}>{order.product_name}</td>
                <td style={{ padding: "14px 20px", fontWeight: "600" }}>{order.quantity}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    fontSize: "12px", 
                    fontWeight: "700",
                    display: "inline-block",
                    ...getStatusStyle(order.status)
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: "14px 20px", color: "#64748b", fontSize: "12px" }}>
                  {order.requested_date && order.requested_date !== "N/A" ? order.requested_date : (order.created_at ? order.created_at : "2026-06-02")}
                </td>
                <td style={{ padding: "14px 20px", textAlign: "right" }}>{renderActions(order)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
