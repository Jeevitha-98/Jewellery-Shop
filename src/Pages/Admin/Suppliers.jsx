import React, { useState } from "react";
import { useAdmin } from "../../Context/AdminContext";

export default function Suppliers() {
  const { suppliers, loading, logActivity } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [localStatuses, setLocalStatuses] = useState({});

  const filteredSuppliers =
    suppliers?.filter((s) => {
      const matchString =
        `${s.user_id} ${s.business_name} ${s.location} ${s.mobile}`.toLowerCase();
      return matchString.includes(searchTerm.toLowerCase());
    }) || [];

  if (loading) {
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          color: "#64748b",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <p style={{ fontSize: "16px", fontWeight: "500" }}>
          Loading system suppliers data registry...
        </p>
      </div>
    );
  }

  const openActionModal = (supplier, type) => {
    setSelectedSupplier(supplier);
    setModalType(type);
  };

  const closeActionModal = () => {
    setSelectedSupplier(null);
    setModalType(null);
  };

  const handleConfirmAction = () => {
    if (!selectedSupplier || !modalType) return;

    const sId = selectedSupplier.user_id;
    const bName = selectedSupplier.business_name;

    if (modalType === "block") {
      setLocalStatuses((prev) => ({
        ...prev,
        [sId]: "Blocked",
      }));

      logActivity(
        `Security alert: Admin manually BLOCKED supplier execution pipe for "${bName}" (${sId}).`,
        "Security",
        true
      );
    } else if (modalType === "approve") {
      setLocalStatuses((prev) => ({
        ...prev,
        [sId]: "Approved",
      }));

      logActivity(
        `System registry: Admin APPROVED registration profile configurations for "${bName}" (${sId}).`,
        "Registry",
        false
      );
    }

    closeActionModal();
  };

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "'Inter', -apple-system, sans-serif",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#0f172a",
              margin: "0 0 6px 0",
            }}
          >
            Supplier Management
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
            }}
          >
            Review directory credentials, approve verified distribution
            profiles, or restrict access pathways.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 16px",
              width: "280px",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <th
                  style={{
                    padding: "16px 24px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Supplier ID
                </th>

                <th
                  style={{
                    padding: "16px 24px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Business Name
                </th>

                <th
                  style={{
                    padding: "16px 24px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Mobile Number
                </th>

                <th
                  style={{
                    padding: "16px 24px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Location
                </th>

                <th
                  style={{
                    padding: "16px 24px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    padding: "16px 24px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#64748b",
                    textTransform: "uppercase",
                    textAlign: "right",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => {
                  const currentStatus =
                    localStatuses[supplier.user_id] || "Active";

                  return (
                    <tr
                      key={supplier.user_id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background-color 0.2s",
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        {supplier.user_id}
                      </td>

                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#334155",
                        }}
                      >
                        <div>{supplier.business_name}</div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#94a3b8",
                            marginTop: "2px",
                          }}
                        >
                          {supplier.business_type || "Wholesaler"}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#475569",
                        }}
                      >
                        {supplier.mobile}
                      </td>

                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#475569",
                        }}
                      >
                        {supplier.location}
                      </td>

                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            backgroundColor:
                              currentStatus === "Approved" ||
                              currentStatus === "Active"
                                ? "#ecfdf5"
                                : currentStatus === "Blocked"
                                ? "#fee2e2"
                                : "#fffbeb",

                            color:
                              currentStatus === "Approved" ||
                              currentStatus === "Active"
                                ? "#10b981"
                                : currentStatus === "Blocked"
                                ? "#ef4444"
                                : "#f59e0b",
                          }}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "16px 24px",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            onClick={() =>
                              openActionModal(supplier, "view")
                            }
                            style={{
                              padding: "6px 12px",
                              border: "1px solid #e2e8f0",
                              background: "white",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#475569",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              openActionModal(supplier, "approve")
                            }
                            disabled={currentStatus === "Approved"}
                            style={{
                              padding: "6px 12px",
                              border: "none",
                              background: "#10b981",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "white",
                              cursor:
                                currentStatus === "Approved"
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                currentStatus === "Approved" ? 0.5 : 1,
                            }}
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              openActionModal(supplier, "block")
                            }
                            disabled={currentStatus === "Blocked"}
                            style={{
                              padding: "6px 12px",
                              border: "none",
                              background: "#ef4444",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "white",
                              cursor:
                                currentStatus === "Blocked"
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                currentStatus === "Blocked" ? 0.5 : 1,
                            }}
                          >
                            Block
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: "48px",
                      color: "#94a3b8",
                      fontSize: "14px",
                      textAlign: "center",
                    }}
                  >
                    No matching supplier records found inside system registry
                    database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalType && selectedSupplier && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              width: "460px",
              padding: "28px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #f1f5f9",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#0f172a",
                margin: "0 0 14px 0",
                textTransform: "capitalize",
              }}
            >
              {modalType === "view"
                ? "Supplier Profile Details"
                : `${modalType} Supplier Account`}
            </h3>

            {modalType === "view" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  margin: "20px 0",
                  fontSize: "14px",
                }}
              >
                <div>
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Supplier ID:
                  </span>{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {selectedSupplier.user_id}
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Business Name:
                  </span>{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {selectedSupplier.business_name}
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Business Category:
                  </span>{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {selectedSupplier.business_type || "Wholesaler"}
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Mobile Number:
                  </span>{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {selectedSupplier.mobile}
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Operating Location:
                  </span>{" "}
                  <strong style={{ color: "#0f172a" }}>
                    {selectedSupplier.location}
                  </strong>
                </div>

                <div>
                  <span
                    style={{
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    System Status:
                  </span>{" "}
                  <strong
                    style={{
                      color:
                        localStatuses[selectedSupplier.user_id] ===
                        "Blocked"
                          ? "#ef4444"
                          : "#10b981",
                    }}
                  >
                    {localStatuses[selectedSupplier.user_id] ||
                      "Active"}
                  </strong>
                </div>
              </div>
            ) : (
              <p
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  lineHeight: "1.6",
                  margin: "16px 0 24px 0",
                }}
              >
                Are you sure you want to proceed with executing the status
                update to [
                {modalType === "block" ? "Blocked" : "Approved"}] for
                supplier profile "{selectedSupplier.business_name}" (
                {selectedSupplier.user_id})?
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
                borderTop: "1px solid #f1f5f9",
                paddingTop: "16px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={closeActionModal}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                {modalType === "view" ? "Close" : "Cancel"}
              </button>

              {modalType !== "view" && (
                <button
                  onClick={handleConfirmAction}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    background:
                      modalType === "block"
                        ? "#ef4444"
                        : "#10b981",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}