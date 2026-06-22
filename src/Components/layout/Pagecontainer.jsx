import React from "react";

export default function PageContainer({ children }) {
  const containerStyle = {
    padding: "24px 32px",
    background: "#f8fafc",
    minHeight: "calc(100vh - 70px)",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%",
  };

  return <div style={containerStyle}>{children}</div>;
}
