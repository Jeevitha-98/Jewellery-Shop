import React, { useState, useEffect } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useVendor } from "../../Context/Vendorcontext";

export default function RequestProduct() {
  const {
    availableProducts,
    pendingRequests,
    acceptedRequests,
    createProductRequest,
    refreshVendorData,
    loading,
  } = useVendor();

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
    const pendingList = (pendingRequests || []).map((r) => ({
      ...r,
      status: "Pending",
    }));

    const acceptedList = (acceptedRequests || []).map((r) => ({
      ...r,
      status: "Accepted",
    }));

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
      (p) => String(p.id) === String(selectedProductId)
    );

    if (!targetProduct) return;

    setActionLoading(true);

    const payload = {
      supplier_id: targetProduct.supplier_id,
      product_name: targetProduct.name,
      quantity: Number(requestQuantity),
      notes: notes ? notes.trim() : "",
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
        return {
          background: "#e6f4ea",
          color: "#137333",
          border: "1px solid #c4eed0",
        };

      case "Rejected":
        return {
          background: "#fee2e2",
          color: "#c53030",
          border: "1px solid #fecaca",
        };

      default:
        return {
          background: "#fff7ed",
          color: "#a16207",
          border: "1px solid #fef08a",
        };
    }
  };

  const headerWrapperStyle = {
    marginBottom: "32px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "20px",
    textAlign: "left",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  };

  const mainHeadingStyle = {
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.02em",
  };

  const subHeadingStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "400",
  };

  const tableContainerStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    width: "100%",
    boxSizing: "border-box",
  };

  const tableTitleBarStyle = {
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  };

  const segmentConsoleStyle = {
    display: "flex",
    backgroundColor: "#f1f5f9",
    padding: "4px",
    borderRadius: "8px",
    gap: "2px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "14px",
  };

  const thStyle = {
    padding: "18px 24px",
    background: "#f8fafc",
    color: "#475569",
    fontWeight: "600",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    borderBottom: "1px solid #e2e8f0",
  };

  const tdStyle = {
    padding: "18px 24px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  };

  const customSelectDropdownStyle = {
    width: "100%",
    height: "42px",
    padding: "0 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    cursor: "pointer",
    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
  };

  if (loading) {
    return (
      <PageContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "40vh",
            width: "100%",
          }}
        >
          <style>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>

          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #cbd5e1",
              borderTop: "3px solid #2563eb",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* HEADER */}
      <div style={headerWrapperStyle}>
        <div style={{ textAlign: "left" }}>
          <h2 style={mainHeadingStyle}>
            Product Procurement Requests
          </h2>

          <p style={subHeadingStyle}>
            Raise fresh stock requirements and monitor
            submission logs seamlessly.
          </p>
        </div>

        <Button
          onClick={handleOpenForm}
          style={{
            height: "42px",
            padding: "0 20px",
            fontWeight: "600",
            borderRadius: "10px",
            boxShadow:
              "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          + Request Product
        </Button>
      </div>

      {/* TABLE */}
      <div style={tableContainerStyle}>
        <div style={tableTitleBarStyle}>
          <span
            style={{
              fontSize: "16px",
              fontWeight: "700",
              color: "#0f172a",
            }}
          >
            My Requests Queue
          </span>

          <div style={segmentConsoleStyle}>
            {["All", "Pending", "Accepted", "Rejected"].map(
              (tab) => {
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
                      backgroundColor: isSelected
                        ? "#ffffff"
                        : "transparent",
                      color: isSelected
                        ? "#2563eb"
                        : "#475569",
                      boxShadow: isSelected
                        ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                        : "none",
                      transition: "all 0.15s ease-in-out",
                    }}
                  >
                    {tab}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Supplier</th>
                <th style={thStyle}>Message / Note</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req, i) => {
                  if (!req) return null;

                  const targetProductName =
                    req.product || req.product_name || "";

                  const matchedProduct = (
                    availableProducts || []
                  ).find(
                    (p) =>
                      p &&
                      p.name &&
                      p.name.toLowerCase() ===
                        targetProductName.toLowerCase()
                  );

                  const resolvedImage =
                    req.product_image ||
                    req.image ||
                    req.image_url ||
                    matchedProduct?.image ||
                    matchedProduct?.image_url;

                  const customStatusStyle =
                    getStatusStyle(req.status);

                  return (
                    <tr
                      key={req.id || i}
                      style={{
                        transition:
                          "background-color 0.2s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "#f8fafc")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "transparent")
                      }
                    >
                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                          }}
                        >
                          {resolvedImage ? (
                            <img
                              src={resolvedImage}
                              alt={targetProductName}
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                border:
                                  "1px solid #e2e8f0",
                                backgroundColor:
                                  "#f8fafc",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "8px",
                                backgroundColor:
                                  "#f1f5f9",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border:
                                  "1px solid #e2e8f0",
                                color: "#94a3b8",
                                fontSize: "11px",
                                fontWeight: "600",
                              }}
                            >
                              N/A
                            </div>
                          )}

                          <span
                            style={{
                              fontWeight: "600",
                              color: "#0f172a",
                            }}
                          >
                            {targetProductName}
                          </span>
                        </div>
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          fontFamily:
                            "'JetBrains Mono', 'Fira Code', monospace",
                          fontWeight: "600",
                          color: "#0f172a",
                          fontSize: "14px",
                        }}
                      >
                        {req.quantity} units
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          color: "#475569",
                          fontWeight: "500",
                        }}
                      >
                        {req.supplier_name ||
                          req.supplier_id ||
                          "Global Wholesaler"}
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          color: "#64748b",
                          fontWeight: "400",
                          maxWidth: "240px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {req.notes ||
                          req.message ||
                          "—"}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "6px 14px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "inline-block",
                            letterSpacing: "0.02em",
                            backgroundColor:
                              customStatusStyle.background,
                            color:
                              customStatusStyle.color,
                            border:
                              customStatusStyle.border,
                          }}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      color: "#94a3b8",
                      padding: "48px",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    No procurement requests match the
                    selected status tag filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Raise Procurement Request"
      >
        <form
          onSubmit={handleSubmitRequest}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            marginTop: "8px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#344054",
              }}
            >
              Select Marketplace Product
            </label>

            <select
              required
              value={selectedProductId}
              onChange={(e) =>
                setSelectedProductId(e.target.value)
              }
              style={customSelectDropdownStyle}
            >
              <option value="">
                -- Click to choose product asset --
              </option>

              {(availableProducts || []).map(
                (prod) =>
                  prod && (
                    <option
                      key={prod.id}
                      value={prod.id}
                    >
                      {prod.name} (Supplier:{" "}
                      {prod.supplier_id || "Global"}) — ₹
                      {prod.price}
                    </option>
                  )
              )}
            </select>
          </div>

          <Input
            label="Required Volume (Units)"
            type="number"
            min="1"
            required
            value={requestQuantity}
            onChange={(e) =>
              setRequestQuantity(e.target.value)
            }
          />

          <Input
            label="Procurement Message / Dispatch Notes"
            placeholder="Provide routing codes or additional notes for the wholesaler..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "12px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              style={{
                flex: 1,
                height: "42px",
                fontWeight: "600",
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              style={{
                flex: 1,
                height: "42px",
                fontWeight: "600",
              }}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Submitting Request..."
                : "Dispatch Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </PageContainer>
  );
}