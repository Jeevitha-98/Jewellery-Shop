import React from "react";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  name,
  disabled = false,
  style = {},
}) {
  const containerStyle = {
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    userSelect: "none",
  };

  const inputBaseStyle = {
    height: "40px",
    width: "100%",
    padding: "0 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    backgroundColor: disabled ? "#f8fafc" : "#ffffff",
    cursor: disabled ? "not-allowed" : "text",
    boxSizing: "border-box",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{ ...inputBaseStyle, ...style }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = "#2563eb";
            e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.15)";
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.target.style.borderColor = "#cbd5e1";
            e.target.style.boxShadow = "none";
          }
        }}
      />
    </div>
  );
}
