import React from "react";

export default function Card({ title, value, icon }) {
  const baseStyle = {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
    border: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    boxSizing: "border-box",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
  };

  return (
    <div
      style={baseStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.06)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.04)";
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
          {title}
        </p>
        <h2 style={{ margin: 0, color: "#0f172a", fontSize: "28px", fontWeight: "700" }}>
          {value}
        </h2>
      </div>

      <div style={{ fontSize: "28px", color: "#64748b", display: "flex", alignItems: "center" }}>
        {icon}
      </div>
    </div>
  );
}
