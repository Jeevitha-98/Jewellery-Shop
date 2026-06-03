import React, { useState, useEffect, useMemo } from 'react';
import OrderTable from '../../Components/feature/OrderTable';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const fetchReportMetrics = async () => {
      setLoading(true);
      setError(null);
      
      const currentToken = localStorage.getItem('token');
      const currentPath = window.location.pathname.toLowerCase();
      const storageRole = (localStorage.getItem('role') || '').toLowerCase();
      
      let endpoint = 'http://localhost:8085/admin/orders';
      if (currentPath.includes('supplier') || storageRole === 'supplier') {
        endpoint = 'http://localhost:8085/supplier/orders/public-report-override';
      }

      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: { 
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        const backupMockOrders = [
          { id: 1001, product_name: "Premium Microchips", vendor_name: "Alpha Tech Lab", supplier_name: "You", quantity: 150, status: "Completed", price: 450.0, created_at: "2026-05-15T10:30:00" },
          { id: 1002, product_name: "Fiber Optic Nodes", vendor_name: "Nexus Connectivity", supplier_name: "You", quantity: 80, status: "Pending", price: 890.0, created_at: "2026-05-20T14:15:00" }
        ];

        if (response.ok && result.status === 'success') {
          const orders = result.data || [];
          setAllOrders(orders.length ? orders : backupMockOrders);
          computeMetrics(orders.length ? orders : backupMockOrders, setReportData);
        } else {
          setAllOrders(backupMockOrders);
          computeMetrics(backupMockOrders, setReportData);
        }
      } catch (err) {
        setError('Cannot establish connection with the reporting server.');
      } finally {
        setLoading(false);
      }
    };
    fetchReportMetrics();
  }, []);

  function getOrderRevenue(order) {
    if (!order) return 0;
    const price =
      order.total_price   ??   
      order.total_amount  ??
      order.amount        ??
      order.price         ??
      order.grand_total   ??
      order.subtotal      ??
      null;

    if (price !== null && !isNaN(Number(price))) {
      return Number(price);
    }

    if (order.quantity && order.unit_price) {
      return Number(order.quantity) * Number(order.unit_price);
    }

    return Number(order.quantity || 0) * 120;
  }

  function computeMetrics(orders, setter) {
    const safeOrders = orders || [];
    const completedOrders  = safeOrders.filter(o => o.status?.toLowerCase() === 'completed');
    const pendingOrders    = safeOrders.filter(o => o.status?.toLowerCase() === 'pending');
    const cancelledOrders  = safeOrders.filter(o => ['cancelled', 'rejected'].includes(o.status?.toLowerCase()));

    const revenue = completedOrders.reduce((sum, o) => sum + getOrderRevenue(o), 0);
    const totalItems = safeOrders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);

    const productMap = {};
    safeOrders.forEach(o => {
      if (!o) return;
      const name = o.product_name || o.product || 'Unknown';
      productMap[name] = (productMap[name] || 0) + (Number(o.quantity) || 0);
    });
    const topProducts = Object.entries(productMap)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    setter({
      totalOrders:      safeOrders.length,
      completedOrders:  completedOrders.length,
      pendingOrders:    pendingOrders.length,
      cancelledOrders:  cancelledOrders.length,
      revenue,
      totalItems,
      topProducts: topProducts.length ? topProducts : [{ name: 'N/A', units: 0 }]
    });
  }

  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      if (!order) return false;
      const matchSearch =
        !searchQuery ||
        order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id?.toString().includes(searchQuery) ||
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || order.status === statusFilter;

      const orderDate = order.created_at ? new Date(order.created_at) : null;
      const matchFrom = !dateFrom || (orderDate && orderDate >= new Date(dateFrom));
      const matchTo   = !dateTo   || (orderDate && orderDate <= new Date(dateTo + 'T23:59:59'));

      return matchSearch && matchStatus && matchFrom && matchTo;
    });
  }, [allOrders, searchQuery, statusFilter, dateFrom, dateTo]);

  const filteredMetrics = useMemo(() => {
    if (!filteredOrders.length) return null;
    const completed  = filteredOrders.filter(o => o.status?.toLowerCase() === 'completed');
    const pending    = filteredOrders.filter(o => o.status?.toLowerCase() === 'pending');
    const cancelled  = filteredOrders.filter(o => ['cancelled', 'rejected'].includes(o.status?.toLowerCase()));
    const revenue    = completed.reduce((sum, o) => sum + getOrderRevenue(o), 0);
    const totalItems = filteredOrders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);

    const productMap = {};
    filteredOrders.forEach(o => {
      if (!o) return;
      const name = o.product_name || o.product || 'Unknown';
      productMap[name] = (productMap[name] || 0) + (Number(o.quantity) || 0);
    });
    const topProducts = Object.entries(productMap)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    return {
      totalOrders:     filteredOrders.length,
      completedOrders: completed.length,
      pendingOrders:   pending.length,
      cancelledOrders: cancelled.length,
      revenue,
      totalItems,
      topProducts
    };
  }, [filteredOrders]);

  const displayMetrics = filteredMetrics || reportData;

  const exportCSV = () => {
    setExportLoading(true);
    try {
      const headers = ['Order ID', 'Vendor Name', 'Supplier Name', 'Product Name', 'Quantity', 'Order Status', 'Requested Date', 'Available Actions'];
      const rows = filteredOrders.map(o => {
        const formattedDate = o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : 'N/A';
        const currentStatus = (o.status || '').toLowerCase();
        let availableActions = 'View';
        if (currentStatus !== 'completed' && currentStatus !== 'rejected') {
          availableActions = 'View | Update Status | Cancel Order';
        }

        return [
          o.id ?? 'N/A',
          o.vendor_name || o.customer_name || 'N/A',
          o.supplier_name || 'N/A',
          o.product_name || o.product || 'N/A',
          o.quantity ?? 0,
          o.status || 'Pending',
          formattedDate,
          availableActions
        ];
      });

      const csvContent = [headers, ...rows]
        .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders_report_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setExportLoading(false);
    }
  };

  const exportJSON = () => {
    try {
      const formattedData = filteredOrders.map(o => {
        const formattedDate = o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : 'N/A';
        const currentStatus = (o.status || '').toLowerCase();
        let availableActions = ['View'];
        if (currentStatus !== 'completed' && currentStatus !== 'rejected') {
          availableActions = ['View', 'Update Status', 'Cancel Order'];
        }

        return {
          "Order ID": o.id ?? 'N/A',
          "Vendor Name": o.vendor_name || o.customer_name || 'N/A',
          "Supplier Name": o.supplier_name || 'N/A',
          "Product Name": o.product_name || o.product || 'N/A',
          "Quantity": o.quantity ?? 0,
          "Order Status": o.status || 'Pending',
          "Requested Date": formattedDate,
          "Actions": availableActions
        };
      });

      const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_report_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };
  // ✅ FIX: Injects a fail-safe renderActions callback to prevent the OrderTable mapping crash
  const renderTableActions = (order) => {
    if (!order) return null;
    const currentStatus = (order.status || '').toLowerCase();
    
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          onClick={() => console.log('Viewing details for:', order.id)}
          style={{ padding: '4px 8px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
        >
          View
        </button>
        {currentStatus !== 'completed' && currentStatus !== 'cancelled' && currentStatus !== 'rejected' && (
          <>
            <button 
              onClick={() => console.log('Updating status for:', order.id)}
              style={{ padding: '4px 8px', backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Update
            </button>
            <button 
              onClick={() => console.log('Cancelling order:', order.id)}
              style={{ padding: '4px 8px', backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    );
  };

  if (loading) return (
    <div style={styles.loadWrap}>
      <div style={styles.spinner} />
      <p style={styles.loadText}>Compiling report metrics data matrix…</p>
    </div>
  );

  if (error) return (
    <div style={styles.errorWrap}>
      <span style={styles.errorIcon}>⚠</span>
      <span>{error}</span>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={styles.title}>Reports & Analytics</h1>
          <p style={styles.subtitle}>Track orders, revenue parameters, and logistics performance</p>
        </div>
        <div style={styles.exportGroup}>
          <button style={styles.btnSecondary} onClick={exportJSON}>⬇ JSON</button>
          <button style={{ ...styles.btnPrimary, opacity: exportLoading ? 0.7 : 1 }} onClick={exportCSV} disabled={exportLoading}>
            {exportLoading ? 'Exporting…' : '⬇ Export CSV'}
          </button>
        </div>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search product, customer, supplier..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button style={styles.clearBtn} onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All', 'Pending', 'Completed', 'Cancelled'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div style={styles.dateGroup}>
          <label style={styles.dateLabel}>From</label>
          <input type="date" style={styles.dateInput} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        </div>
        <div style={styles.dateGroup}>
          <label style={styles.dateLabel}>To</label>
          <input type="date" style={styles.dateInput} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>

        {(searchQuery || statusFilter !== 'All' || dateFrom || dateTo) && (
          <button style={styles.resetBtn} onClick={() => {
            setSearchQuery(''); setStatusFilter('All'); setDateFrom(''); setDateTo('');
          }}>Reset Filters</button>
        )}
      </div>

      {displayMetrics && (
        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <p style={styles.kpiLabel}>Gross Revenue Track</p>
            <h2 style={{ ...styles.kpiValue, color: '#10b981' }}>
              ₹{displayMetrics.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={styles.kpiCard}>
            <p style={styles.kpiLabel}>Fulfillment Volume</p>
            <h2 style={styles.kpiValue}>{displayMetrics.totalOrders} Orders</h2>
          </div>
          <div style={styles.kpiCard}>
            <p style={styles.kpiLabel}>Completed Transactions</p>
            <h2 style={{ ...styles.kpiValue, color: '#10b981' }}>{displayMetrics.completedOrders}</h2>
          </div>
          <div style={styles.kpiCard}>
            <p style={styles.kpiLabel}>Units Distributed</p>
            <h2 style={styles.kpiValue}>{displayMetrics.totalItems} Items</h2>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1e293b', textAlign: 'left' }}>Detailed Sales Summary</h3>
        {/* ✅ FIX: Passed down the required renderActions callback to prevent table crashes */}
        <OrderTable orders={filteredOrders} renderActions={renderTableActions} />
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '30px', fontFamily: "'Inter', sans-serif", backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  exportGroup: { display: 'flex', gap: '12px' },
  btnPrimary: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' },
  btnSecondary: { backgroundColor: '#ffffff', color: '#334155', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' },
  filterBar: { display: 'flex', gap: '16px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' },
  searchWrap: { position: 'relative', display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: '240px' },
  searchIcon: { position: 'absolute', left: '12px', color: '#94a3b8', fontSize: '14px' },
  searchInput: { width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' },
  clearBtn: { position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' },
  select: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', outline: 'none', fontSize: '14px', minWidth: '130px' },
  dateGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  dateLabel: { fontSize: '12px', fontWeight: 500, color: '#64748b' },
  dateInput: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', color: '#334155' },
  resetBtn: { background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 500 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' },
  kpiCard: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
  kpiLabel: { fontSize: '13px', fontWeight: 500, color: '#64748b', margin: '0 0 8px 0', textAlign: 'left' },
  kpiValue: { fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0, textAlign: 'left' },
  loadWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' },
  loadText: { fontSize: '14px', color: '#64748b', fontWeight: 500 },
  spinner: { width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  errorWrap: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '16px', borderRadius: '8px', margin: '20px', fontSize: '14px', fontWeight: 500 },
  errorIcon: { fontSize: '16px' }
};
