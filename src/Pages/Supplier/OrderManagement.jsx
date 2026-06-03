import React, { useState, useEffect, useContext } from 'react';
import OrderTable from '../../Components/feature/OrderTable';
// ✅ FIXED: Connects directly to the native centralized notification module context
import { NotificationContext } from '../../components/layout/NotificationContext';

export default function OrderManagement() {
  // ✅ CONSUME PIPELINE: Pull the explicit refresh action center handler
  const { refresh: refreshNotifications } = useContext(NotificationContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchSupplierOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8085/supplier/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        setOrders(result.data);
      } else {
        setError(result.detail || 'Failed to sync supply records from the database.');
      }
    } catch (err) {
      setError('Cannot establish server connection. Verify your backend process is running on port 8085.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierOrders();
  }, []);

  const handleUpdateStatus = async (orderId, targetStatus) => {
    try {
      const response = await fetch(`http://localhost:8085/supplier/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: targetStatus })
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        fetchSupplierOrders();
        // ✅ REAL-TIME REFRESH TRIGGER: Forces notification bar to pull backend updates instantly
        if (typeof refreshNotifications === 'function') {
          refreshNotifications();
        }
      } else {
        alert(result.detail || 'Status alteration validation failed.');
      }
    } catch (err) {
      alert('Network transmission error encountered during state sync.');
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    approved: orders.filter(o => o.status === 'Approved' || o.status === 'Accepted').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    completed: orders.filter(o => o.status === 'Completed').length,
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    const pName = String(order.product_name || "").toLowerCase();
    const vName = String(order.vendor_name || "").toLowerCase();
    const sQuery = searchTerm.toLowerCase();

    const matchesSearch = pName.includes(sQuery) || vName.includes(sQuery) || String(order.id || "").includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || 
                          order.status === statusFilter || 
                          (statusFilter === 'Approved' && order.status === 'Accepted');
    return matchesSearch && matchesStatus;
  });
  const renderSupplierActions = (order) => (
    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
      
      {/* 1. VIEW ACTION BUTTON */}
      <button 
        onClick={() => setSelectedOrder(order)}
        style={{ padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#334155" }}
      >
        View
      </button>

      {/* 2. UPDATE STATUS DROPDOWN WIDGET */}
      <select
        value={order.status === 'Accepted' ? 'Approved' : order.status}
        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
        style={{ padding: "6px 10px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#fff", fontSize: "12px", color: "#475569", fontWeight: "600", cursor: "pointer", outline: "none" }}
      >
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Processing">Processing</option>
        <option value="Completed">Completed</option>
        <option value="Rejected">Rejected</option>
      </select>

      {/* 3. CANCEL ORDER DIRECT ACTION BUTTON */}
      {order.status !== 'Rejected' && order.status !== 'Completed' && (
        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to cancel this order request?")) {
              handleUpdateStatus(order.id, 'Rejected');
            }
          }}
          style={{ padding: "6px 12px", backgroundColor: "#fee2e2", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
        >
          Cancel Order
        </button>
      )}
    </div>
  );

  return (
    <div style={{ padding: "32px", fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", boxSizing: "border-box", width: "100%" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0" }}>Order Management</h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px", margin: "0" }}>Monitor complete incoming order workflows and issue supplier approvals.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: 'Total Requests', count: stats.total, color: "#2563eb" },
          { label: 'Pending Steps', count: stats.pending, color: "#d97706" },
          { label: 'Approved Lines', count: stats.approved, color: "#059669" },
          { label: 'In Processing', count: stats.processing, color: "#4f46e5" },
          { label: 'Completed Deliveries', count: stats.completed, color: "#475569" },
        ].map((card, i) => (
          <div key={i} style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: "#94a3b8" }}>{card.label}</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "24px", fontWeight: "700", color: card.color }}>{loading ? '...' : card.count}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center" }}>
        <input type="text" placeholder="Search Order ID, product, or vendor..." style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#fff", fontSize: "14px", color: "#475569", fontWeight: "500", outline: "none" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved / Accepted</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontWeight: "500" }}>Syncing live database records...</div>
      ) : error ? (
        <div style={{ padding: "16px", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", color: "#ef4444", borderRadius: "8px", fontWeight: "600", fontSize: "14px" }}>{error}</div>
      ) : (
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <OrderTable orders={filteredOrders} renderActions={renderSupplierActions} />
        </div>
      )}

      {/* ✅ FIXED: Restored complete View Dialog Overlay Modal Portal Window */}
      {selectedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", width: "400px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", color: "#0f172a", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>Order Detail Audit</h3>
            <p style={{ margin: "8px 0", fontSize: "14px", color: "#475569", textAlign: "left" }}><strong>Order ID:</strong> #{selectedOrder.id}</p>
            <p style={{ margin: "8px 0", fontSize: "14px", color: "#475569", textAlign: "left" }}><strong>Product Name:</strong> {selectedOrder.product_name}</p>
            <p style={{ margin: "8px 0", fontSize: "14px", color: "#475569", textAlign: "left" }}><strong>Vendor Client:</strong> {selectedOrder.vendor_name || "N/A"}</p>
            <p style={{ margin: "8px 0", fontSize: "14px", color: "#475569", textAlign: "left" }}><strong>Quantity Requested:</strong> {selectedOrder.quantity} Units</p>
            <p style={{ margin: "8px 0", fontSize: "14px", color: "#475569", textAlign: "left" }}><strong>Fulfillment Status:</strong> <span style={{ color: "#2563eb", fontWeight: 600 }}>{selectedOrder.status}</span></p>
            <button 
              onClick={() => setSelectedOrder(null)} 
              style={{ marginTop: "20px", width: "100%", padding: "10px 0", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}
            >
              Close Record Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
