import React, { useState, useEffect } from 'react';
import OrderTable from '../../Components/feature/OrderTable';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    supplier_id: '',
    product_name: '',
    quantity: '',
    notes: ''
  });

  const fetchVendorOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8085/vendor/orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        setOrders(result.data || []);
      } else {
        setError(result.detail || 'Failed to sync your order logs.');
      }
    } catch (err) {
      setError('Cannot establish server connection. Verify your backend process is running on port 8085.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!formData.supplier_id || !formData.product_name || !formData.quantity) {
      alert("Please populate all form requirements before submission.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8085/vendor/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          supplier_id: String(formData.supplier_id),
          product_name: String(formData.product_name),
          quantity: int = parseInt(formData.quantity, 10),
          notes: String(formData.notes || '')
        })
      });

      const result = await response.json();
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ supplier_id: '', product_name: '', quantity: '', notes: '' });
        fetchVendorOrders();
      } else {
        alert(result.detail || 'Failed to create order request.');
      }
    } catch (err) {
      alert('Error connecting to operational backend layer.');
    }
  };

  const handleUpdateStatus = async (orderId, targetStatus) => {
    try {
      const response = await fetch(`http://localhost:8085/vendor/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: targetStatus })
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        fetchVendorOrders();
      } else {
        alert(result.detail || 'Status modification validation failed.');
      }
    } catch (err) {
      alert('Network transmission error encountered during state sync.');
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'Pending').length,
    approved: orders.filter((o) => o.status === 'Approved' || o.status === 'Accepted').length,
    processing: orders.filter((o) => o.status === 'Processing').length,
    completed: orders.filter((o) => o.status === 'Completed').length
  };

  const filteredOrders = orders.filter((order) => {
    if (!order) return false;
    const pName = String(order.product_name || "").toLowerCase();
    const vName = String(order.vendor_name || "").toLowerCase();
    const sQuery = searchTerm.toLowerCase();

    return (pName.includes(sQuery) || vName.includes(sQuery) || String(order.id || "").includes(searchTerm)) &&
           (statusFilter === 'All' || order.status === statusFilter || (statusFilter === 'Approved' && order.status === 'Accepted'));
  });
  const renderVendorActions = (order) => (
    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
      <button 
        onClick={() => setSelectedOrder(order)}
        style={{ padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "#334155" }}
      >
        View
      </button>

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
    <div style={{ padding: '32px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', width: '100%' }}>
      {/* Header element bar container layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0' }}>Order Management</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', margin: '0' }}>
            Initiate procurement demands, update lifecycle states, and track fulfillment tracks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          Create New Request
        </button>
      </div>

      {/* Numerical Metrics Summary Widget grids cards line */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Requests', count: stats.total, color: '#2563eb' },
          { label: 'Pending Steps', count: stats.pending, color: '#d97706' },
          { label: 'Approved Lines', count: stats.approved, color: '#059669' },
          { label: 'In Processing', count: stats.processing, color: '#4f46e5' },
          { label: 'Completed Deliveries', count: stats.completed, color: '#475569' }
        ].map((card, i) => (
          <div key={i} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'left' }}>
            <p style={{ margin: '0', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#94a3b8' }}>{card.label}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '700', color: card.color }}>{loading ? '...' : card.count}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Search / Dropdown Filter parameters line control box */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <input type="text" placeholder="Search Order ID, product name, or status context..." style={{ flex: 1, padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#fff", fontSize: "14px", color: "#475569", fontWeight: "500", outline: "none" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved / Accepted</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Primary Data List Component Rendering Target Anchor */}
      {error && <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>⚠ {error}</div>}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <OrderTable orders={filteredOrders} renderActions={renderVendorActions} />
      </div>

      {/* ✅ HIGH-END INTERACTIVE POPUP FORM MODAL CONTAINER WINDOW */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <form onSubmit={handleCreateOrder} style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', boxSizing: 'border-box', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Request Stock Components</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Target Supplier ID Link</label>
              <input type="text" placeholder="e.g. 2 or supplier_id hash string" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} value={formData.supplier_id} onChange={e => setFormData({ ...formData, supplier_id: e.target.value })} required />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Product Component Description Title</label>
              <input type="text" placeholder="e.g. Sugar, Chocolate, Rice" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} value={formData.product_name} onChange={e => setFormData({ ...formData, product_name: e.target.value })} required />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Ordered Volume Quantity Units</label>
              <input type="number" min="1" placeholder="Minimum 1 item block volume" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px' }} value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '10px 16px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Submit Request</button>
            </div>
          </form>
        </div>
      )}

      {/* DETAILED RECORD VIEW DIALOG PORTAL MODAL */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '380px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Procurement Order Audit</h3>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569' }}><strong>Order Ref ID:</strong> #{selectedOrder.id}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569' }}><strong>Product Line Item:</strong> {selectedOrder.product_name}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569' }}><strong>Fulfillment Status:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>{selectedOrder.status}</span></p>
            <button onClick={() => setSelectedOrder(null)} style={{ marginTop: '20px', width: '100%', padding: '10px 0', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Close Window</button>
          </div>
        </div>
      )}
    </div>
  );
}
