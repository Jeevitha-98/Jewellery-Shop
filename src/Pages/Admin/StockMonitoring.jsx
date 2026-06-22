import React, { useState } from "react";
import { useAdmin } from "../../Context/AdminContext";

export default function StockMonitoring() {
  const { products, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "low" | "out"

  // Define inventory safety thresholds
  const LOW_STOCK_THRESHOLD = 15;

  const filteredProducts = (products || []).filter((product) => {
    const stockCount = parseInt(product.stock || product.quantity || 0, 10);
    
    // 🔍 1. Apply Search Matching (Product Name, Category, or Supplier ID)
    const matchString = `${product.name} ${product.category} ${product.supplier_id}`.toLowerCase();
    const matchesSearch = matchString.includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // 📊 2. Apply Stock Level Filtering Drops
    if (filterType === "out") return stockCount === 0;
    if (filterType === "low") return stockCount > 0 && stockCount <= LOW_STOCK_THRESHOLD;
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: "32px", textAlign: "center", color: "#64748b", fontFamily: "Inter, sans-serif" }}>
        <p style={{ fontSize: "16px", fontWeight: "500" }}>Loading real-time stock telemetry metrics...</p>
      </div>
    );
  }

  // Calculate dynamic dashboard sub-metrics for tracking headers
  const totalStockItems = products?.length || 0;
  const lowStockCount = products?.filter(p => {
    const s = parseInt(p.stock || p.quantity || 0, 10);
    return s > 0 && s <= LOW_STOCK_THRESHOLD;
  }).length || 0;
  const outOfStockCount = products?.filter(p => parseInt(p.stock || p.quantity || 0, 10) === 0).length || 0;

  return (
    <div style={{ padding: "32px", fontFamily: "'Inter', -apple-system, sans-serif", width: "100%", boxSizing: "border-box" }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>Stock Monitoring</h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Review system warehouse capacities, check low storage items, and monitor supply chains.</p>
        </div>
        
        {/* Search Bar Input */}
        <div>
          <input
            type="text"
            placeholder="Search items, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 16px",
              width: "280px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </div>

      {/* Analytics Counter Banner Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <button 
          onClick={() => setFilterType("all")}
          style={{
            padding: "12px 20px", borderRadius: "10px", border: "1px solid #e2e8f0", cursor: "pointer", fontSize: "14px", fontWeight: "600",
            backgroundColor: filterType === "all" ? "#0f172a" : "#ffffff",
            color: filterType === "all" ? "#ffffff" : "#475569"
          }}
        >
          All Items ({totalStockItems})
        </button>
        <button 
          onClick={() => setFilterType("low")}
          style={{
            padding: "12px 20px", borderRadius: "10px", border: "1px solid #fee2e2", cursor: "pointer", fontSize: "14px", fontWeight: "600",
            backgroundColor: filterType === "low" ? "#fffbeb" : "#ffffff",
            color: "#d97706"
          }}
        >
          Low Stock Warning ({lowStockCount})
        </button>
        <button 
          onClick={() => setFilterType("out")}
          style={{
            padding: "12px 20px", borderRadius: "10px", border: "1px solid #fee2e2", cursor: "pointer", fontSize: "14px", fontWeight: "600",
            backgroundColor: filterType === "out" ? "#fee2e2" : "#ffffff",
            color: "#ef4444"
          }}
        >
          Critical Out of Stock ({outOfStockCount})
        </button>
      </div>

      {/* Main Stock Inventory Grid Table */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Product Thumbnail</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Product Identity</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Supplier Hub</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Category</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Price Metrics</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Current Stock Level</th>
                <th style={{ padding: "16px 24px", fontSize: "12px", fontWeight: "600", color: "#64748b", textTransform: "uppercase" }}>Status Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const currentStock = parseInt(product.stock || product.quantity || 0, 10);
                  
                  // Compute dynamic alert parameters
                  let badgeBg = "#ecfdf5";
                  let badgeColor = "#10b981";
                  let stockStatus = "Sufficient";

                  if (currentStock === 0) {
                    badgeBg = "#fee2e2";
                    badgeColor = "#ef4444";
                    stockStatus = "Out of Stock";
                  } else if (currentStock <= LOW_STOCK_THRESHOLD) {
                    badgeBg = "#fffbeb";
                    badgeColor = "#d97706";
                    stockStatus = "Low Warning";
                  }

                  return (
                    <tr key={product.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background-color 0.2s" }}>
                      <td style={{ padding: "16px 24px" }}>
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                          />
                        ) : (
                          <div style={{ width: "42px", height: "42px", borderRadius: "8px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "11px", fontWeight: "600" }}>NO IMG</div>
                        )}
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{product.name}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: "#475569" }}>{product.supplier_id || "Global Supplier"}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: "#475569" }}>{product.category}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: "#0f172a", fontWeight: "600" }}>₹{Number(product.price).toFixed(2)}</td>
                      <td style={{ padding: "16px 24px", fontSize: "14px", color: currentStock === 0 ? "#ef4444" : "#1e293b", fontWeight: currentStock <= LOW_STOCK_THRESHOLD ? "600" : "400" }}>
                        {currentStock} units
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", padding: "4px 10px", borderRadius: "12px", backgroundColor: badgeBg, color: badgeColor }}>
                          {stockStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ padding: "48px", color: "#94a3b8", fontSize: "14px", textAlign: "center" }}>
                    No inventory records match the selected stock criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
