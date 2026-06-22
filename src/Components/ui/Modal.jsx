import React, { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out",
  };

  const containerStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    animation: "slideUp 0.2s ease-out",
  };

  const headerStyle = {
    padding: "16px 20px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const titleStyle = {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
  };

  const closeButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "20px",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  };

  const contentStyle = {
    padding: "20px",
    overflowY: "auto",
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{title || "Notification"}</h3>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            &times;
          </button>
        </div>

        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
}
