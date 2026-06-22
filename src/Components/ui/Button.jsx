import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {},
}) {
  const baseStyle = {
    height: "36px",
    padding: "0 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    userSelect: "none",
    transition: "all 0.2s ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    boxSizing: "border-box",
  };

  const variants = {
    primary: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
    },
    success: {
      backgroundColor: "#16a34a",
      color: "#ffffff",
    },
    danger: {
      backgroundColor: "#dc2626",
      color: "#ffffff",
    },
    secondary: {
      backgroundColor: "#64748b",
      color: "#ffffff",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variants[variant],
        ...style,
      }}
      onMouseOver={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "0.9";
      }}
      onMouseOut={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "1";
      }}
    >
      {children}
    </button>
  );
}


