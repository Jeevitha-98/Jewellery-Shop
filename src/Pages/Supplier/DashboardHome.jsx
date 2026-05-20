import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Card from "../../components/ui/Card";
import { useInventory } from "../../Context/Inventorycontext"; 

export default function DashboardHome() {
  const { products, vendorRequests } = useInventory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []); // Static initial spinner sequence only to prevent component layout flicker

  // LIVE EXTRACTION: Runs smoothly on every background mutation cycle
  const safeProducts = products || [];

  const totalProducts = safeProducts.length;

  const totalStock = safeProducts.reduce(
    (sum, item) => sum + Number(item?.stock || 0),
    0
  );

  const lowStock = safeProducts.filter(
    (p) => Number(p?.stock || 0) < 5
  ).length;

  const pendingRequestsCount = (vendorRequests || []).filter(
    (r) => r.status === "Pending"
  ).length;

  const stats = [
    { title: "Total Products", value: totalProducts, icon: "📦" },
    { title: "Overall Stock", value: totalStock.toLocaleString("en-IN"), icon: "📊" },
    { title: "Low Stock Items", value: lowStock, icon: "⚠️" },
    { title: "Pending Requests", value: pendingRequestsCount, icon: "⏳" },
  ];

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", width: "100%" }}>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
          <div style={spinnerStyle} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={{ marginBottom: "32px", boxSizing: "border-box" }}>
        <h2 style={{ margin: "0 0 6px 0", fontSize: "26px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" }}>
          Welcome Back, Supplier
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "400" }}>
          Here is an analytical breakdown of your warehouse stock metrics.
        </p>
      </div>

      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {stats.map((s, i) => (
          <Card
            key={i}
            title={s.title}
            value={s.value}
            icon={s.icon}
          />
        ))}
      </div>
    </PageContainer>
  );
}

const spinnerStyle = {
  width: "40px",
  height: "40px",
  border: "3px solid #cbd5e1",
  borderTop: "3px solid #2563eb",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

