import React, { createContext, useState, useContext, useEffect } from "react";
import adminService from "../Services/adminService";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [suppliers, setSuppliers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [adminNotifications, setAdminNotifications] = useState(() => {
    const saved = localStorage.getItem("admin_activity_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const logActivity = (actionText, actionBadge = "System", isUrgent = false) => {
    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: actionText,
      badge: actionBadge,
      urgent: isUrgent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAdminNotifications((prev) => {
      const updated = [newActivity, ...prev].slice(0, 10);
      localStorage.setItem("admin_activity_logs", JSON.stringify(updated));
      return updated;
    });
  };

  const refreshDashboardData = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role?.toLowerCase() !== "admin") {
      setLoading(false);
      return;
    }

    try {
      const [suppliersRes, vendorsRes, productsRes, metricsRes, profileRes] = await Promise.all([
        adminService.getSuppliers().catch(err => {
          console.error("Error loading Suppliers:", err.message);
          return [];
        }),
        adminService.getVendors().catch(err => {
          console.error("Error loading Vendors:", err.message);
          return [];
        }),
        adminService.getProducts().catch(err => {
          console.error("Error loading Products:", err.message);
          return [];
        }),
        adminService.getMetrics().catch(err => {
          console.error("Error loading Metrics:", err.message);
          return null;
        }),
        adminService.getProfile().catch(err => {
          console.error("Error loading Profile:", err.message);
          return null;
        })
      ]);

      setSuppliers(Array.isArray(suppliersRes) ? suppliersRes : []);
      setVendors(Array.isArray(vendorsRes) ? vendorsRes : []);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setMetrics(metricsRes || null);
      setProfile(profileRes || null);
    } catch (err) {
      console.error("Critical error inside admin dashboard sync routine:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role?.toLowerCase() === "admin") {
      refreshDashboardData();
      if (localStorage.getItem("admin_activity_logs") === null) {
        logActivity("Admin master workspace authenticated and secure connection established.", "Auth", false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        suppliers,
        vendors,
        products,
        metrics,
        profile,
        loading,
        adminNotifications,
        logActivity,
        refreshDashboardData
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
