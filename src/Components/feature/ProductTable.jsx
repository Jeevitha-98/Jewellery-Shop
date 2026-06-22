import React from "react";

export default function ProductTable({ products, onEdit, onDelete, onView }) {
  const cellStyle = {
    padding: "16px 20px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    verticalAlign: "middle",
    boxSizing: "border-box",
  };

  const thStyle = {
    padding: "16px 20px",
    background: "#f8fafc",
    color: "#64748b",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    boxSizing: "border-box",
  };

  const inlineBtnBase = {
    height: "36px",
    padding: "0 16px",
    borderRadius: "8px",             
    border: "1px solid transparent",  
    fontSize: "13px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    boxSizing: "border-box",          
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
  };

  return (
    <div 
      style={{ 
        background: "white", 
        borderRadius: "12px", 
        border: "1px solid #e2e8f0", 
        overflow: "hidden", 
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)"
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", boxSizing: "border-box" }}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((p) => (
              <tr 
                key={p.id}
                style={{ transition: "background 0.2s", boxSizing: "border-box" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ ...cellStyle }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", boxSizing: "border-box" }}>
                    <img 
                      src={p.image || "https://unsplash.com"} 
                      alt={p.name} 
                      style={{ 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "8px", 
                        objectFit: "cover", 
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#f8fafc"
                      }} 
                    />
                    <span style={{ fontWeight: "500", color: "#0f172a" }}>{p.name}</span>
                  </div>
                </td>
                
                <td style={cellStyle}>{p.category}</td>
                <td style={{ ...cellStyle, fontFamily: "monospace", color: "#475569" }}>{p.stock}</td>
                <td style={{ ...cellStyle, fontWeight: "500" }}>₹{p.price}</td>
                
                <td style={cellStyle}>
                  <span
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",    
                      border: "1px solid",    
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "inline-block",
                      boxSizing: "border-box",
                      backgroundColor: p.stock > 5 ? "#f0fdf4" : p.stock > 0 ? "#fefce8" : "#fef2f2",
                      borderColor: p.stock > 5 ? "#bbf7d0" : p.stock > 0 ? "#fef08a" : "#fee2e2",
                      color: p.stock > 5 ? "#166534" : p.stock > 0 ? "#854d0e" : "#991b1b",
                    }}
                  >
                    {p.stock > 5 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                  </span>
                </td>

                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", boxSizing: "border-box" }}>
                    
                    <button 
                      onClick={() => onView(p)} 
                      style={{ 
                        ...inlineBtnBase, 
                        backgroundColor: "#ffffff", 
                        borderColor: "#cbd5e1", 
                        color: "#475569" 
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#f1f5f9";
                        e.currentTarget.style.color = "#0f172a";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.color = "#475569";
                      }}
                    >
                      View
                    </button>

                    <button 
                      onClick={() => onEdit(p)} 
                      style={{ 
                        ...inlineBtnBase, 
                        backgroundColor: "#2563eb", 
                        color: "#ffffff" 
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                    >
                      Edit
                    </button>

                    <button 
                      onClick={() => onDelete(p.id)} 
                      style={{ 
                        ...inlineBtnBase, 
                        backgroundColor: "#fef2f2", 
                        borderColor: "#fee2e2", 
                        color: "#dc2626" 
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#dc2626";
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.borderColor = "#dc2626";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#fef2f2";
                        e.currentTarget.style.color = "#dc2626";
                        e.currentTarget.style.borderColor = "#fee2e2";
                      }}
                    >
                      Delete
                    </button>

                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ ...cellStyle, textAlign: "center", color: "#64748b", padding: "32px" }}>
                No products found matching filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
