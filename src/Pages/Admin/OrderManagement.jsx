import React, { useState, useEffect, useContext } from 'react';
import OrderTable from '../../Components/feature/OrderTable';
// ✅ FIXED PATHING: Point explicitly to your working centralized NotificationContext location
import { NotificationContext } from '../../components/layout/NotificationContext'; 

export default function OrderManagement() {
  // ✅ FIXED RESOLUTION: Hooks directly into the active context manager polling actions stream
  const { refresh: refreshNotifications } = useContext(NotificationContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAdminOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8085/admin/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        setOrders(result.data || []);
      } else {
        setError(result.detail || 'Failed to load orders.');
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running on port 8085.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const handleUpdateStatus = async (orderId, targetStatus) => {
    try {
      const response = await fetch(`http://localhost:8085/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: targetStatus })
      });
      const result = await response.json();
      if (response.ok && result.status === 'success') {
        fetchAdminOrders();
        // ✅ REAL-TIME ALERTS REFRESHER: Forces the notification bar context to poll backend instantly
        if (typeof refreshNotifications === 'function') {
          refreshNotifications();
        }
      } else {
        alert(result.detail || 'Failed to update order status.');
      }
    } catch (err) {
      alert('Network error while updating order.');
    }
  };

  const stats = {
    total:      orders.length,
    pending:    orders.filter(o => o.status?.toLowerCase() === 'pending').length,
    approved:   orders.filter(o => ['approved', 'accepted'].includes(o.status?.toLowerCase())).length,
    processing: orders.filter(o => o.status?.toLowerCase() === 'processing').length,
    completed:  orders.filter(o => o.status?.toLowerCase() === 'completed').length,
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    const matchesSearch =
      (order.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.vendor_name?.toLowerCase()   || '').includes(searchTerm.toLowerCase()) ||
      (order.supplier_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.id?.toString()               || '').includes(searchTerm);
    const matchesStatus =
      statusFilter === 'All' ||
      order.status === statusFilter ||
      (statusFilter === 'Approved' && order.status === 'Accepted');
    return matchesSearch && matchesStatus;
  });
  const renderAdminActions = (order) => (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={() => setSelectedOrder(order)}
        style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#334155' }}
      >
        View
      </button>

      <select
        value={order.status === 'Accepted' ? 'Approved' : order.status}
        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
        style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', fontSize: '12px', color: '#475569', fontWeight: '600', cursor: 'pointer', outline: 'none' }}
      >
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Processing">Processing</option>
        <option value="Completed">Completed</option>
        <option value="Rejected">Rejected</option>
      </select>

      {!['completed', 'rejected'].includes(order.status?.toLowerCase()) && (
        <button
          onClick={() => {
            if (window.confirm('Mark this order as Completed?')) {
              handleUpdateStatus(order.id, 'Completed');
            }
          }}
          style={{ padding: '6px 12px', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
        >
          ✓ Complete
        </button>
      )}

      {!['completed', 'rejected'].includes(order.status?.toLowerCase()) && (
        <button
          onClick={() => {
            if (window.confirm('Cancel this order?')) {
              handleUpdateStatus(order.id, 'Rejected');
            }
          }}
          style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
        >
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0' }}>Order Management</h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px', margin: '0' }}>
          Manage and update order statuses across all suppliers and vendors.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Orders',        count: stats.total,      color: '#2563eb' },
          { label: 'Pending',             count: stats.pending,    color: '#d97706' },
          { label: 'Approved',            count: stats.approved,   color: '#059669' },
          { label: 'Processing',          count: stats.processing, color: '#4f46e5' },
          { label: 'Completed',           count: stats.completed,  color: '#10b981' },
        ].map((card, i) => (
          <div key={i} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: '0', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#94a3b8' }}>{card.label}</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '700', color: card.color }}>
              {loading ? '...' : card.count}
            </p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by order ID, product, vendor, or supplier..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', minWidth: '240px' }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {/* ✅ FIXED: Restored complete select drop menu options parameters node trees */}
        <select
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', color: '#475569', fontWeight: '500', outline: 'none', cursor: 'pointer', minWidth: '180px' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved / Accepted</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Grid Data Items Listing Render target */}
      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
          ⚠ {error}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
        <OrderTable orders={filteredOrders} renderActions={renderAdminActions} />
      </div>

      {/* ✅ FIXED: Restored complete Detailed Overlay Modal Audit Dialog Popup */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', width: '420px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a' }}>Procurement Line Audit</h3>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569', textAlign: 'left' }}><strong>Order ID:</strong> #{selectedOrder.id}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569', textAlign: 'left' }}><strong>Product Item:</strong> {selectedOrder.product_name}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569', textAlign: 'left' }}><strong>Vendor Source:</strong> {selectedOrder.vendor_name || "N/A"}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569', textAlign: 'left' }}><strong>Supplier Link:</strong> {selectedOrder.supplier_name || "N/A"}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569', textAlign: 'left' }}><strong>Quantity Block:</strong> {selectedOrder.quantity} Units</p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#475569', textAlign: 'left' }}><strong>Current Status:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>{selectedOrder.status}</span></p>
            <button 
              onClick={() => setSelectedOrder(null)} 
              style={{ marginTop: '20px', width: '100%', padding: '10px 0', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Close Record Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
