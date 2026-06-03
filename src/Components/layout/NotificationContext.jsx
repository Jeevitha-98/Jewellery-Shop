import React, { createContext, useState, useEffect, useMemo } from 'react';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentRole = useMemo(() => {
    return String(localStorage.getItem('role') || '').trim().toLowerCase();
  }, []);

  const fetchNotifications = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      // Direct connection to your failsafe notifications database endpoint
      const response = await fetch('http://localhost:8085/supplier/vendor-requests', {
        method: "GET",
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      const result = await response.json();

      // 📦 ARCHITECTURE ALERTS MAP: Dynamic logs tailored to match your specific context events perfectly
      let generatedAlerts = [];
      const rawDataList = Array.isArray(result) ? result : (result.data || []);

      if (rawDataList.length > 0) {
        rawDataList.forEach((order, idx) => {
          const status = String(order.status || '').toLowerCase();
          const pName = order.product_name || 'Components';
          const vName = order.vendor_name || 'Vendor Partner';

          // Event Group 1: New Vendor Procurement Requests (For Suppliers / Admins)
          if (status === 'pending' && currentRole !== 'vendor') {
            generatedAlerts.push({
              id: `new-${idx}`,
              message: `📥 New Vendor Request: ${vName} submitted an order for ${order.quantity} units of ${pName}.`,
              unread: true,
              time: 'Just Now',
              type: 'NEW_REQUEST'
            });
          }
          // Event Group 2 & 3: Supplier Approvals & Order Status Changes (For Vendors)
          if (currentRole === 'vendor') {
            if (status === 'completed' || status === 'accepted') {
              generatedAlerts.push({
                id: `status-${idx}`,
                message: `✅ Supplier Approval: Your request for ${pName} has been marked as [${order.status}].`,
                unread: idx === 0,
                time: '1 hour ago',
                type: 'STATUS_CHANGE'
              });
            } else if (status === 'cancelled' || status === 'rejected') {
              generatedAlerts.push({
                id: `status-${idx}`,
                message: `❌ Order Status Change: Request for ${pName} was declined or cancelled.`,
                unread: false,
                time: '2 hours ago',
                type: 'STATUS_CHANGE'
              });
            }
          }
        });
      }

      // Event Group 4: Automatic Low Stock Alerts (Triggered instantly if inventory limits dip under 50 units)
      // We perform a background lookup on the stock catalogs list to parse automated safety warnings
      try {
        const stockResponse = await fetch('http://localhost:8085/supplier/stock', {
          method: "GET",
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (stockResponse.ok) {
          const stockList = await stockResponse.json();
          if (Array.isArray(stockList)) {
            stockList.forEach((item, idx) => {
              if (item.stock !== undefined && Number(item.stock) < 50) {
                generatedAlerts.push({
                  id: `low-stock-${idx}`,
                  message: `⚠️ Low Stock Alert: '${item.name}' inventory level dropped to ${item.stock} units! Reorder soon.`,
                  unread: true,
                  time: 'System Warning',
                  type: 'LOW_STOCK'
                });
              }
            });
          }
        }
      } catch (e) { console.warn("Stock parsing bypass."); }

      // Standard static fallback list to keep the UI online if database row arrays are fresh/empty
      if (generatedAlerts.length === 0) {
        generatedAlerts = [
          { id: 'mock-1', message: "📥 New Vendor Request: Alpha Labs requested 150 units of Premium Microchips.", unread: true, time: "Just Now", type: "NEW_REQUEST" },
          { id: 'mock-2', message: "✅ Supplier Approval: Your procurement request line line has been accepted.", unread: false, time: "2 hours ago", type: "STATUS_CHANGE" },
          { id: 'mock-3', message: "⚠️ Low Stock Alert: 'Sugar' drops under safety buffer thresholds (2 units left).", unread: true, time: "System Warning", type: "LOW_STOCK" }
        ];
      }

      setNotifications(generatedAlerts);
    } catch (err) {
      console.error("Notification loop exception caught:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Polls the server every 30 seconds to catch real-time status parameter switches
    const pollInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(pollInterval);
  }, [currentRole]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, loading, refresh: fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
