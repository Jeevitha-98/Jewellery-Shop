import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SupplierDashboard() {
  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    } else if (role !== "supplier") {
      navigate("/login");
    }
  }, []);

 
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

     
      <div
        style={{
          width: "220px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Supplier Panel</h2>

        <hr style={{ margin: "10px 0" }} />

        <p>Dashboard</p>
        <p>Orders</p>
        <p>Requests</p>
        <p>Vendors</p>
        <p>Reports</p>

        <button
          onClick={logout}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      
      <div style={{ flex: 1, background: "#f3f4f6" }}>

        
        <div
          style={{
            height: "60px",
            background: "white",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            justifyContent: "space-between",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Supplier Dashboard</h3>

          <span>Role: Supplier</span>
        </div>

        
        <div style={{ padding: "20px" }}>
          <h2>Welcome Supplier 👋</h2>
          <p>Manage your orders, vendors, and business requests here.</p>
        </div>

      </div>
    </div>
  );
}