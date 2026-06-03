import React, { useState, useContext, useMemo } from 'react';
import { NotificationContext } from './NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead, loading } = useContext(NotificationContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const safeNotifications = useMemo(() => {
    return Array.isArray(notifications) ? notifications : [];
  }, [notifications]);

  // Color map markers to visually anchoring alert types for faster dashboard scannability
  const getTypeStyles = (type) => {
    switch (type) {
      case 'LOW_STOCK': return { borderLeft: '4px solid #ef4444', iconColor: '#ef4444' };
      case 'NEW_REQUEST': return { borderLeft: '4px solid #3b82f6', iconColor: '#3b82f6' };
      default: return { borderLeft: '4px solid #10b981', iconColor: '#10b981' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Read / Unread Status Badge Counter Icon */}
      <div style={styles.iconWrap} onClick={() => setShowDropdown(!showDropdown)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </div>

      {/* Notification Dropdown Layout */}
      {showDropdown && (
        <div style={styles.dropdown}>
          <div style={styles.dropHeader}>
            <h4 style={styles.headerText}>Activity Logs Notification Bar</h4>
            {unreadCount > 0 && (
              <span style={styles.markRead} onClick={markAllAsRead}>
                Mark all read
              </span>
            )}
          </div>
          <div style={styles.listWrap}>
            {loading ? (
              <p style={styles.emptyText}>Updating status tracking maps...</p>
            ) : (
              safeNotifications.map((n) => {
                const badgeConfig = getTypeStyles(n.type);
                return (
                  <div key={n.id} style={{ ...styles.alertRow, ...badgeConfig, backgroundColor: n.unread ? '#f8fafc' : '#ffffff' }}>
                    <div style={styles.dotWrap}>
                      {n.unread && <span style={styles.unreadDot} />}
                    </div>
                    <div style={{ textAlign: 'left', flexGrow: 1 }}>
                      <p style={styles.alertText}>{n.message}</p>
                      <span style={styles.alertTime}>{n.time || "Recent"}</span>
                    </div>
                  </div>
                );
              })
            )}
            {!loading && safeNotifications.length === 0 && (
              <p style={styles.emptyText}>Zero activity tracking logs found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { position: 'relative', display: 'inline-block', fontFamily: "'Inter', sans-serif" },
  iconWrap: { position: 'relative', cursor: 'pointer', padding: '8px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' },
  badge: { position: 'absolute', top: '2px', right: '2px', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', minWidth: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', boxSizing: 'border-box' },
  dropdown: { position: 'absolute', top: '46px', right: '0', width: '340px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', zIndex: 1000, overflow: 'hidden' },
  dropHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' },
  headerText: { margin: 0, fontSize: '14px', fontWeight: 600, color: '#1e293b' },
  markRead: { fontSize: '12px', color: '#3b82f6', cursor: 'pointer', fontWeight: 500, userSelect: 'none' },
  listWrap: { maxHeight: '320px', overflowY: 'auto' },
  alertRow: { display: 'flex', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' },
  dotWrap: { display: 'flex', alignItems: 'center', minWidth: '8px' },
  unreadDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' },
  alertText: { margin: '0 0 4px 0', fontSize: '13px', color: '#334155', lineHeight: '1.45', fontWeight: 500 },
  alertTime: { fontSize: '11px', color: '#94a3b8' },
  emptyText: { margin: 0, padding: '24px', fontSize: '13px', color: '#64748b', textAlign: 'center' }
};
