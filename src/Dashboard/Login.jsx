// src/pages/auth/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import API from "../Services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [showRegister, setShowRegister] = useState(false);

  const [registerMobile, setRegisterMobile] = useState("");
  const [location, setLocation] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!mobile || mobile.length !== 10) {
      setError("Enter valid 10-digit mobile number");
      return;
    }

    if (!password.trim()) {
      setError("Enter password (User ID)");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        mobile,
        password,
      });

      const data = response.data;
      
      // FIXED: Safeguard string extraction step against capitalized server properties ("Admin" / "ADMIN")
      const userRole = data.role ? String(data.role).toLowerCase() : "";

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", userRole); // Stores forced lowercase format matching your AdminLayout verification check
      localStorage.setItem("user_id", data.user_id);

      if (userRole === "supplier") {
        navigate("/supplier/dashboard");
      } 
      else if (userRole === "vendor") {
        navigate("/vendor/dashboard");
      } 
      else if (userRole === "admin") {
        navigate("/admin/dashboard");
      } 
      else {
        setError("Invalid role or permission profile context missing");
      }

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!registerMobile || registerMobile.length !== 10) {
      setError("Enter valid 10-digit mobile number");
      return;
    }

    if (!location.trim() || !businessName.trim() || !businessType.trim()) {
      setError("All fields are required");
      return;
    }

    if (!role) {
      setError("Select role");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/auth/register", {
        mobile: registerMobile,
        location,
        business_name: businessName,
        business_type: businessType,
        role,
      });

      const data = response.data;
      
      alert(`Account created successfully\nUser ID: ${data.user_id}`);

      setRegisterMobile("");
      setLocation("");
      setBusinessName("");
      setBusinessType("");
      setRole("");

      setShowRegister(false);
      setError("");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1 className="login-title">
            Supplier & Vendor Platform
          </h1>
          <p className="login-subtext">
            Manage suppliers, vendors, and admin workflows efficiently
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form">
          {!showRegister && (
            <>
              <h2>Login</h2>

              <input
                className="login-input"
                type="tel"
                maxLength={10}
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, ""))
                }
              />

              <input
                className="login-input"
                type="password"
                placeholder="Password (User ID)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />

              <button
                className="login-button"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Login"}
              </button>

              {error && <p className="error-text">{error}</p>}
            </>
          )}

          {showRegister && (
            <>
              <h2>Register</h2>

              <input
                className="login-input"
                type="tel"
                maxLength={10}
                placeholder="Mobile Number"
                value={registerMobile}
                onChange={(e) =>
                  setRegisterMobile(e.target.value.replace(/\D/g, ""))
                }
              />

              <input
                className="login-input"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                className="login-input"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <input
                className="login-input"
                placeholder="Business Type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />

              <select
                className="login-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="supplier">Supplier</option>
                <option value="vendor">Vendor</option>
              </select>

              <button
                className="login-button"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              {error && <p className="error-text">{error}</p>}
            </>
          )}

          <div className="login-link">
            {!showRegister ? (
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setError("");
                    setShowRegister(true);
                  }}
                >
                  Register here
                </span>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setError("");
                    setShowRegister(false);
                  }}
                >
                  Login here
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
