import React, { useState, useEffect } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useVendor } from "../../Context/Vendorcontext";

export default function RequestProduct() {
  const { availableProducts, pendingRequests, acceptedRequests, createProductRequest, refreshVendorData, loading } = useVendor();

  const [statusFilter, setStatusFilter] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState("");
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (refreshVendorData) refreshVendorData();
  }, []);

  const getUnifiedRequestsList = () => {
    const pendingList = (pendingRequests || []).map(r => ({ ...r, status: "Pending" }));
    const acceptedList = (acceptedRequests || []).map(r => ({ ...r, status: "Accepted" }));
    return [...pendingList, ...acceptedList];
  };

  const allRequests = getUnifiedRequestsList();

  const filteredRequests = allRequests.filter((req) => {
    if (!req) return false;
    if (statusFilter === "All") return true;
    return req.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleOpenForm = () => {
    setSelectedProductId("");
    setRequestQuantity(1);
    setNotes("");
    setIsOpen(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    const targetProduct = availableProducts.find(
      p => String(p.id) === String(selectedProductId)
    );
    if (!targetProduct) return;

    setActionLoading(true);

    const payload = {
      supplier_id: targetProduct.supplier_id,
      product_name: targetProduct.name,
      quantity: Number(requestQuantity),
      notes: notes ? notes.trim() : ""
    };

    const result = await createProductRequest(payload);
    setActionLoading(false);

    if (result.success) {
      alert("Procurement request submitted successfully!");
      setIsOpen(false);
    } else {
      alert(result.error || "Failed to process request");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return { background: "#e6f4ea", color: "#137333" };
      case "Rejected":
        return { background: "#fde2e2", color: "#c62828" };
      default:
        return { background: "#fff7e6", color: "#b26a00" };
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Loading requests...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>

      {/* HEADER (UNCHANGED TEXT PRESERVED) */}
      <div style={{
        marginBottom: "20px",
        padding: "18px",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", color: "#0f172a" }}>
            Product Procurement Requests
          </h2>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "13px" }}>
            Raise fresh stock requirements and monitor submission logs.
          </p>
        </div>

        <Button onClick={handleOpenForm}>+ Request Product</Button>
      </div>

      {/* TABLE CARD */}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        overflow: "hidden"
      }}>

        {/* FILTER BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid #e2e8f0"
        }}>
          <strong style={{ color: "#0f172a" }}>My Requests Queue</strong>

          <div style={{ display: "flex", gap: "8px" }}>
            {["All", "Pending", "Accepted", "Rejected"].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  background: statusFilter === tab ? "#2563eb" : "#f1f5f9",
                  color: statusFilter === tab ? "#fff" : "#475569"
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={th}>Product</th>
              <th style={th}>Quantity</th>
              <th style={th}>Supplier</th>
              <th style={th}>Message / Note</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length > 0 ? filteredRequests.map((req, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={tdBold}>{req.product || req.product_name}</td>
                <td style={td}>{req.quantity}</td>
                <td style={td}>{req.supplier_name || req.supplier_id}</td>

                {/* MESSAGE COLUMN (KEPT + IMPROVED) */}
                <td style={{ ...td, color: "#64748b" }}>
                  {req.notes || req.message || "—"}
                </td>

                <td style={td}>
                  <span style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    ...getStatusStyle(req.status)
                  }}>
                    {req.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                  No procurement records matching selection found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL (UNCHANGED LOGIC) */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Request Product Stock">
        <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={handleSubmitRequest}>

          <label>Select Product *</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          >
            <option value="">Choose product</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <label>Quantity *</label>
          <Input type="number" min="1" value={requestQuantity}
            onChange={(e) => setRequestQuantity(e.target.value)} />

          <label>Message / Note</label>
          <textarea
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>

        </form>
      </Modal>
    </PageContainer>
  );
}

/* STYLES */
const th = {
  padding: "12px",
  textAlign: "left",
  fontSize: "12px",
  color: "#475569"
};

const td = {
  padding: "12px",
  fontSize: "13px",
  color: "#334155"
};

const tdBold = {
  padding: "12px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#0f172a"
};