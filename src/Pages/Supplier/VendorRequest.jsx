import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Button from "../../components/ui/Button";
import { useInventory } from "../../Context/Inventorycontext"; 
import { toast } from "react-toastify";

export default function VendorRequests() {
  const { products, vendorRequests, updateRequestStatus, refreshDashboardData } = useInventory();
  const [statusFilter, setStatusFilter] = useState("All"); 

  useEffect(() => {
    if (refreshDashboardData) {
      refreshDashboardData();
    }
  }, []);

  const handleAccept = async (id) => {
    const request = (vendorRequests || []).find((r) => r && r.id === id);
    if (!request) return;

    const currentProductName = request.product_name || request.product || "Unknown Product";
    const currentVendorName = request.vendor_name || request.vendorName || "BB";

    const targetProduct = (products || []).find(
      (p) => p && p.name && p.name.toLowerCase() === currentProductName.toLowerCase()
    );

    if (!targetProduct) {
      toast.error(`Error: "${currentProductName}" does not exist in your warehouse system stock.`);
      return;
    }

    // Convert stock properties safely to numbers to bypass verification type drops
    const stockAvailable = Number(targetProduct.stock !== undefined ? targetProduct.stock : (targetProduct.quantity || 0));
    const quantityDemanded = Number(request.quantity || 1);

    if (stockAvailable < quantityDemanded) {
      toast.error(`Insufficient Stock! ${targetProduct.name} only has ${stockAvailable} units left.`);
      return;
    }

    const result = await updateRequestStatus(id, "Accepted");

    if (result && (result.success || result.status === 'success')) {
      // ✅ REAL-TIME DEDUCTION TRIGGER: Forces warehouse memory array units down instantly upon clicking accept button
      if (targetProduct.stock !== undefined) {
        targetProduct.stock = stockAvailable - quantityDemanded;
      } else if (targetProduct.quantity !== undefined) {
        targetProduct.quantity = stockAvailable - quantityDemanded;
      }

      toast.success(`Request accepted! Dispatched ${quantityDemanded} units to ${currentVendorName}.`);
      if (refreshDashboardData) {
        await refreshDashboardData(); 
      }
    } else {
      toast.error(result?.error || "Failed to submit status transformation to database.");
    }
  };

  const handleReject = async (id) => {
    const result = await updateRequestStatus(id, "Rejected");
    if (result && (result.success || result.status === 'success')) {
      toast.info(`Procurement request from vendor rejected successfully.`);
      if (refreshDashboardData) {
        await refreshDashboardData();
      }
    } else {
      toast.error(result?.error || "Failed to submit status transformation to database.");
    }
  };

  const filteredRequests = (vendorRequests || []).filter((req) => {
    if (!req) return false;
    if (statusFilter === "All") return true;
    const currentStatus = String(req.status || "").toLowerCase();
    return currentStatus === statusFilter.toLowerCase();
  });

  const headerWrapperStyle = { fontFamily: "'Inter', sans-serif", marginBottom: "32px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px", textAlign: "left" };
  const mainHeadingStyle = { margin: "0 0 6px 0", fontSize: "26px", fontWeight: "700", color: "#0f172a", letterSpacing: "-0.02em" };
  const subHeadingStyle = { margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "400" };
  const tableContainerStyle = { background: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxSizing: "border-box", marginTop: "8px" };
  const tableTitleBarStyle = { padding: "20px 24px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" };
  const segmentConsoleStyle = { display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "8px", gap: "2px" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px", fontFamily: "'Inter', sans-serif" };
  const thStyle = { padding: "18px 24px", background: "#f8fafc", color: "#475569", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #e2e8f0" };
  const tdStyle = { padding: "18px 24px", color: "#334155", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" };
  const actionContainerStyle = { display: "flex", gap: "10px", alignItems: "center" };
  return (
    <PageContainer>
      <div style={headerWrapperStyle}>
        <h2 style={mainHeadingStyle}>Vendor Requests</h2>
        <p style={subHeadingStyle}>Manage incoming procurement and stock fulfillment requests from vendors.</p>
      </div>

      <div style={tableContainerStyle}>
        <div style={tableTitleBarStyle}>
          <span style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
            Fulfillment Queue
          </span>
          
          <div style={segmentConsoleStyle}>
            {["All", "Pending", "Accepted", "Rejected"].map((tab) => {
              const isSelected = statusFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  style={{
                    border: "none",
                    outline: "none",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    backgroundColor: isSelected ? "#ffffff" : "transparent",
                    color: isSelected ? "#2563eb" : "#475569",
                    boxShadow: isSelected ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" : "none",
                    transition: "all 0.15s ease-in-out"
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

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
              {filteredRequests && filteredRequests.length > 0 ? (
                filteredRequests.map((req) => {
                  if (!req) return null;
                  const displayStatus = req.status || "Pending";
                  
                  const finalVendorName = req.vendor_name || req.vendorName || "BB";
                  const finalProductName = req.product_name || req.product || "Unknown Item";

                  return (
                    <tr
                      key={req.id}
                      style={{ transition: "background-color 0.2s ease" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <td style={{ ...tdStyle, fontWeight: "600", color: "#0f172a" }}>{finalVendorName}</td>
                      <td style={{ ...tdStyle, color: "#475569", fontWeight: "500" }}>{finalProductName}</td>
                      <td style={{ ...tdStyle, fontFamily: "'JetBrains Mono', monospace", fontWeight: "600", color: "#0f172a", fontSize: "14px" }}>{req.quantity ?? 0}</td>
                      
                      {/* ✅ FIXED AND RECONSTRUCTED BADGES: Fully repaired the cutoff syntax loop cleanly */}
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "12px",
                            display: "inline-block",
                            letterSpacing: "0.02em",
                            background:
                              displayStatus === "Accepted" || displayStatus === "Completed" || displayStatus === "Approved"
                                ? "#e6f4ea"
                                : displayStatus === "Rejected" || displayStatus === "Cancelled"
                                ? "#fce8e6"
                                : "#fef3c7",
                            color:
                              displayStatus === "Accepted" || displayStatus === "Completed" || displayStatus === "Approved"
                                ? "#137333"
                                : displayStatus === "Rejected" || displayStatus === "Cancelled"
                                ? "#c5221f"
                                : "#b45309"
                          }}
                        >
                          {displayStatus}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div style={actionContainerStyle}>
                          {displayStatus === "Pending" ? (
                            <React.Fragment>
                              <Button variant="success" size="small" onClick={() => handleAccept(req.id)}>
                                Accept
                              </Button>
                              <Button variant="danger" size="small" onClick={() => handleReject(req.id)}>
                                Reject
                              </Button>
                            </React.Fragment>
                          ) : (
                            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", fontStyle: "italic" }}>
                              Processed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...tdStyle, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No procurement request entries recorded inside this filter queue context.
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
