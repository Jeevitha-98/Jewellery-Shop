import React, { createContext, useState, useContext, useEffect } from "react";
import { supplierService } from "../Services/supplierService";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [vendorRequests, setVendorRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [systemActivities, setSystemActivities] = useState(() => {
    const saved = localStorage.getItem("supplier_activity_logs");
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
    setSystemActivities((prev) => {
      const updated = [newActivity, ...prev].slice(0, 10);
      localStorage.setItem("supplier_activity_logs", JSON.stringify(updated));
      return updated;
    });
  };

  const refreshDashboardData = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role?.toLowerCase() !== "supplier") {
      setLoading(false);
      return;
    }

    try {
      const [stockRes, requestsRes, profileRes] = await Promise.all([
        supplierService.getStockList().catch(err => {
          console.error("Error loading Stock List:", err.message);
          return { data: [] }; 
        }),
        supplierService.getVendorRequests().catch(err => {
          console.error("Error loading Vendor Requests (Server 500):", err.message);
          return { data: { status: "error", data: [] } }; 
        }),
        supplierService.getProfileDetails().catch(err => {
          console.error("Error loading Profile Details:", err.message);
          return null; 
        })
      ]);

      // Unpack stock list records cleanly
      const stockData = stockRes?.data || stockRes;

      // ✅ FIX: Safe unwrapping handles raw Axios objects and backend payload wrappers
      let requestsData = [];
      const rawRequestsObj = requestsRes?.data || requestsRes;
      if (rawRequestsObj) {
        if (Array.isArray(rawRequestsObj)) {
          requestsData = rawRequestsObj;
        } else if (rawRequestsObj.data && Array.isArray(rawRequestsObj.data)) {
          requestsData = rawRequestsObj.data;
        } else if (rawRequestsObj.vendor_requests && Array.isArray(rawRequestsObj.vendor_requests)) {
          requestsData = rawRequestsObj.vendor_requests;
        }
      }

      const profileData = profileRes?.data || profileRes;

      setProducts(Array.isArray(stockData) ? stockData : []);
      setVendorRequests(requestsData);
      setProfile(profileData || null);
    } catch (err) {
      console.error("Critical error inside dashboard sync routine:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role?.toLowerCase() === "supplier") {
      refreshDashboardData();
      if (localStorage.getItem("supplier_activity_logs") === null) {
        logActivity("Supplier workspace authenticated and secure connection established.", "Auth", false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const addGlobalProduct = async (formDataPayload) => {
    try {
      setLoading(true);
      const productName = formDataPayload.get("name") || "Product Item";
      const productStock = formDataPayload.get("stock") || "0";

      const response = await supplierService.addProduct(formDataPayload, true);
      const parsedProduct = response?.data || response;

      if (parsedProduct && parsedProduct.name) {
        setProducts((prev) => {
          const incomingName = parsedProduct.name.toLowerCase();
          const filtered = prev.filter(
            (p) => p && p.name && p.name.toLowerCase() !== incomingName
          );
          return [parsedProduct, ...filtered];
        });
      }

      await refreshDashboardData(); 
      logActivity(`Catalog update: Added/Replenished ${productStock} units of "${productName}" in stock.`, "Stock", false);
      return { success: true };
    } catch (err) {
      console.error("Failed to add product:", err);
      return { 
        success: false, 
        error: err?.response?.data?.detail || err?.response?.data?.message || err.message || "Failed to persist transaction record."
      };
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, nextStatus) => {
    try {
      const targetReq = vendorRequests.find(r => r.id === requestId);
      const pName = targetReq ? (targetReq.product_name || targetReq.product) : "Goods";
      const vName = targetReq ? (targetReq.vendor_name || targetReq.vendorName) : "Vendor";

      await supplierService.updateVendorRequestStatus(requestId, nextStatus);
      
      setVendorRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: nextStatus } : req))
      );

      logActivity(`Order finalized: Procurement from "${vName}" for "${pName}" status set to [${nextStatus}].`, "Order", nextStatus === "Rejected");
      await refreshDashboardData();
      return { success: true };
    } catch (err) {
      console.error("Failed to update vendor transaction status:", err);
      return { success: false, error: err.message };
    }
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        products, 
        setProducts, 
        vendorRequests, 
        setVendorRequests, 
        profile,
        loading,
        systemActivities, 
        logActivity,      
        addGlobalProduct,
        updateRequestStatus,
        refreshDashboardData
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
