import React, { createContext, useState, useContext, useEffect } from "react";
import { vendorService } from "../Services/vendorService";

const VendorContext = createContext();

export function VendorProvider({ children }) {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem("vendor_activity_logs");
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
    setActivityLogs((prev) => {
      const updated = [newActivity, ...prev].slice(0, 10);
      localStorage.setItem("vendor_activity_logs", JSON.stringify(updated));
      return updated;
    });
  };

  const refreshVendorData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const [browseRes, ordersRes, requestsRes, profileRes] = await Promise.all([
        vendorService.getBrowseProducts(),
        vendorService.getMyOrders(),
        vendorService.getProductRequests(),
        vendorService.getProfileDetails(),
      ]);

      const browseData = browseRes?.data || browseRes;
      const ordersData = ordersRes?.data || ordersRes;
      const requestsData = requestsRes?.data || requestsRes;
      const profileData = profileRes?.data || profileRes;

      setAvailableProducts(Array.isArray(browseData) ? browseData : []);
      setMyOrders(Array.isArray(ordersData) ? ordersData : []);
      setProfile(profileData || null);

      const allRequests = Array.isArray(requestsData) ? requestsData : [];
      setPendingRequests(allRequests.filter(r => r?.status?.toLowerCase() === "pending"));
      setAcceptedRequests(allRequests.filter(r => r?.status?.toLowerCase() === "accepted"));

    } catch (err) {
      console.error("Failed to sync vendor context across workflow menus:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshVendorData();
      if (localStorage.getItem("vendor_activity_logs") === null) {
        logActivity("Vendor panel authenticated and safe proxy link initialized.", "Auth", false);
      }
    }
  }, []);

  const createProductRequest = async (requestPayload) => {
    try {
      setLoading(true);
      const productName = requestPayload.product || "Inventory Item";
      const quantity = requestPayload.quantity || "0";

      await vendorService.requestProduct(requestPayload);
      
      await refreshVendorData(); 

      logActivity(`Inbound Dispatch: Requested ${quantity} units of "${productName}" from supplier network.`, "Procure", false);

      return { success: true };
    } catch (err) {
      console.error("Failed to submit item procurement request:", err);
      return { 
        success: false, 
        error: err?.response?.data?.detail || err?.response?.data?.message || err.message || "Failed to finalize procurement request ledger."
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorContext.Provider 
      value={{ 
        availableProducts, 
        setAvailableProducts, 
        myOrders, 
        setMyOrders, 
        pendingRequests,
        acceptedRequests,
        profile,
        loading,
        activityLogs, 
        logActivity,      
        createProductRequest,
        refreshVendorData
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within a VendorProvider wrapper layout");
  }
  return context;
}
