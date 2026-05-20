import React from "react";
import PageContainer from "../../components/layout/PageContainer";
import Button from "../../components/ui/Button";
import { useInventory } from "../../Context/Inventorycontext"; 
import { toast } from "react-toastify";

export default function VendorRequests() {
  const { products, setProducts, vendorRequests, setVendorRequests } = useInventory();

  const handleAccept = (id) => {
    const request = vendorRequests.find((r) => r.id === id);
    if (!request || request.status !== "Pending") return;

    const productIndex = products.findIndex(
      (p) => p.name.toLowerCase() === request.product.toLowerCase()
    );

    if (productIndex === -1) {
      toast.error(`Error: "${request.product}" does not exist in inventory.`);
      return;
    }

    const targetProduct = products[productIndex];

    if (targetProduct.stock < request.quantity) {
      toast.error(`Insufficient stock! ${targetProduct.name} only has ${targetProduct.stock} units left.`);
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === targetProduct.id) {
          const updatedStock = p.stock - request.quantity;
          let updatedStatus = "In Stock";
          if (updatedStock === 0) {
            updatedStatus = "Out of Stock";
          } else if (updatedStock <= 5) {
            updatedStatus = "Low Stock";
          }

          return { ...p, stock: updatedStock, status: updatedStatus };
        }
        return p;
      })
    );

    setVendorRequests((prevRequests) =>
      prevRequests.map((req) => (req.id === id ? { ...req, status: "Accepted" } : req))
    );

    toast.success(`Request accepted! Dispatched ${request.quantity} units of ${targetProduct.name}.`);
  };

  const handleReject = (id) => {
    setVendorRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
    toast.info("Vendor request rejected.");
  };

  const headerStyle = {
    margin: "0 0 4px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  };

  const subHeaderStyle = {
    margin: "0 0 24px 0",
    fontSize: "14px",
    color: "#64748b",
  };

  const tableContainerStyle = {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  };

  const thStyle = {
    padding: "16px 20px",
    background: "#f8fafc",
    color: "#64748b",
    fontWeight: "600",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
  };

  const tdStyle = {
    padding: "16px 20px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  };

  const actionContainerStyle = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  };

  return (
    <PageContainer>
      <div>
        <h2 style={headerStyle}>Vendor Requests</h2>
        <p style={subHeaderStyle}>Manage Incoming procurement and stock fulfillment requests from vendors.</p>
      </div>

      <div style={tableContainerStyle}>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {vendorRequests && vendorRequests.length > 0 ? (
                vendorRequests.map((req) => (
                  <tr
                    key={req.id}
                    style={{ transition: "background 0.2s" }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ ...tdStyle, fontWeight: "500", color: "#0f172a" }}>{req.vendorName}</td>
                    <td style={tdStyle}>{req.product}</td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: "500" }}>{req.quantity}</td>
                    
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "9999px",
                          fontWeight: "600",
                          fontSize: "12px",
                          display: "inline-block",
                          background:
                            req.status === "Accepted"
                              ? "#dcfce7"
                              : req.status === "Rejected"
                              ? "#fee2e2"
                              : "#fef9c3",
                          color:
                            req.status === "Accepted"
                              ? "#15803d"
                              : req.status === "Rejected"
                              ? "#b91c1c"
                              : "#a16207",
                        }}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <div style={actionContainerStyle}>
                        <Button
                          variant="success"
                          onClick={() => handleAccept(req.id)}
                          disabled={req.status !== "Pending"}
                        >
                          Accept
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleReject(req.id)}
                          disabled={req.status !== "Pending"}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: "center", color: "#64748b", padding: "32px" }}>
                    No vendor requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
