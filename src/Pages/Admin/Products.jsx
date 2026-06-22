import React, { useState } from "react";
import { useAdmin } from "../../Context/AdminContext";

export default function Products() {
  const { products, loading, logActivity } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null); 
  const [localStatuses, setLocalStatuses] = useState({});
  const [hiddenProducts, setHiddenProducts] = useState(new Set());

  const visibleProducts = products?.filter((p) => !hiddenProducts.has(p.id)) || [];
  const filteredProducts = visibleProducts.filter((p) => {
    const matchString = `${p.name} ${p.category} ${p.supplier_id}`.toLowerCase();
    return matchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: "15px", fontWeight: "500", letterSpacing: "0.01em" }}>
          Loading system product database registry...
        </p>
      </div>
    );
  }

  const openActionModal = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
  };

  const closeActionModal = () => {
    setSelectedProduct(null);
    setModalType(null);
  };

  const handleConfirmAction = () => {
    if (!selectedProduct || !modalType) return;

    const pId = selectedProduct.id;
    const pName = selectedProduct.name;

    if (modalType === "approve") {
      setLocalStatuses((prev) => ({ ...prev, [pId]: "Approved" }));
      logActivity(
        `Catalog Registry: Admin APPROVED item catalog listing for "${pName}" (ID: ${pId}).`,
        "Catalog",
        false
      );
    } else if (modalType === "reject") {
      setLocalStatuses((prev) => ({ ...prev, [pId]: "Rejected" }));
      logActivity(
        `Catalog Registry: Admin REJECTED marketplace item catalog request for "${pName}" (ID: ${pId}).`,
        "Catalog",
        true
      );
    } else if (modalType === "delete") {
      setHiddenProducts((prev) => {
        const next = new Set(prev);
        next.add(pId);
        return next;
      });

      logActivity(
        `Data Purge: Admin DELETED product entry "${pName}" from global system tables.`,
        "Security",
        true
      );
    }

    closeActionModal();
  };

  return (
    <div className="products-management-view">
      <style>{`
        .products-management-view {
          padding: 32px 40px;
          width: 100%;
          box-sizing: border-box;
          background-color: #f8fafc;
        }

        .view-header-layout {
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .title-text-group {
          text-align: left;
        }

        .view-main-heading {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif !important;
          font-size: 26px;
          font-weight: 700;
          color: #0f172a !important;
          margin: 0 0 6px 0;
          letter-spacing: -0.025em !important;
        }

        .view-sub-heading {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        .search-field-asset {
          padding: 12px 18px;
          width: 300px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          font-size: 14px;
          outline: none;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: #1e293b;
        }

        .search-field-asset:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .table-surface-card {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.02),
            0 2px 4px -1px rgba(15, 23, 42, 0.02);
          overflow: hidden;
        }

        .table-scroll-container {
          overflow-x: auto;
          width: 100%;
        }

        .formal-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .formal-data-table th {
          padding: 18px 24px;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .formal-data-table tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
        }

        .formal-data-table tr:last-child {
          border-bottom: none;
        }

        .formal-data-table tr:hover {
          background-color: #f8fafc;
        }

        .formal-data-table td {
          padding: 16px 24px;
          vertical-align: middle;
          color: #334155;
        }

        .thumbnail-frame {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .thumbnail-empty-state {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background-color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid #e2e8f0;
        }

        .item-identity-text {
          font-weight: 600;
          color: #0f172a;
          font-size: 15px;
        }

        .supplier-identity-text {
          color: #475569;
          font-weight: 500;
        }

        .category-pill-tag {
          display: inline-block;
          background-color: #f1f5f9;
          color: #475569;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
        }

        .capacity-indicator {
          font-weight: 500;
        }

        .price-valuation-text {
          font-weight: 700;
          color: #0f172a;
          font-size: 15px;
        }

        .status-pill-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
          display: inline-block;
          letter-spacing: -0.01em;
        }

        .actions-flex-group {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          align-items: center;
        }

        .panel-action-btn {
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-view-style {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .btn-view-style:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        .btn-approve-style {
          background-color: #10b981;
          border: 1px solid transparent;
          color: #ffffff;
        }

        .btn-approve-style:hover:not(:disabled) {
          background-color: #059669;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }

        .btn-reject-style {
          background-color: #f59e0b;
          border: 1px solid transparent;
          color: #ffffff;
        }

        .btn-reject-style:hover:not(:disabled) {
          background-color: #d97706;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
        }

        .btn-delete-style {
          background-color: #fee2e2;
          border: 1px solid transparent;
          color: #ef4444;
        }

        .btn-delete-style:hover {
          background-color: #fca5a5;
          color: #b91c1c;
        }

        .panel-action-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none !important;
        }

        .empty-grid-fallback {
          padding: 48px !important;
          color: #94a3b8;
          font-size: 15px;
          text-align: center;
          font-weight: 500;
        }

        .modal-blur-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-surface-card {
          background-color: #ffffff;
          border-radius: 20px;
          width: 480px;
          padding: 32px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.2);
          border: 1px solid #f1f5f9;
          text-align: left;
          animation: modalRevealAnimation 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalRevealAnimation {
          from {
            transform: scale(0.95) translateY(10px);
            opacity: 0;
          }

          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        .modal-main-heading {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif !important;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a !important;
          margin: 0 0 16px 0;
          letter-spacing: -0.025em !important;
        }

        .modal-specs-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 24px 0;
          font-size: 14.5px;
        }

        .modal-spec-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }

        .modal-spec-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .modal-meta-label {
          color: #64748b;
          font-weight: 500;
        }

        .modal-meta-value {
          color: #0f172a;
          font-weight: 600;
        }

        .modal-prompt-message {
          font-size: 15px;
          color: #475569;
          line-height: 1.6;
          margin: 16px 0 28px 0;
        }

        .modal-footer-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
        }

        .modal-dialog-btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn-cancel {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
        }

        .modal-btn-cancel:hover {
          background-color: #f8fafc;
          color: #0f172a;
        }

        .modal-btn-execution {
          border: none;
          color: #ffffff;
        }
      `}</style>

      <div className="view-header-layout">
        <div className="title-text-group">
          <h1 className="view-main-heading">Product Monitoring</h1>
          <p className="view-sub-heading">
            Track across global supply catalogs, approve batch stock listings,
            or moderate inventory compliance.
          </p>
        </div>

        <input
          type="text"
          className="search-field-asset"
          placeholder="Search items, category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-surface-card">
        <div className="table-scroll-container">
          <table className="formal-data-table">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Supplier Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const currentStatus =
                    localStatuses[product.id] || "Pending Verification";

                  const isOutOfStock =
                    parseInt(product.stock || 0, 10) === 0;

                  let badgeBg = "#fffbeb";
                  let badgeColor = "#d97706";

                  if (currentStatus === "Approved") {
                    badgeBg = "#ecfdf5";
                    badgeColor = "#10b981";
                  } else if (currentStatus === "Rejected") {
                    badgeBg = "#fee2e2";
                    badgeColor = "#ef4444";
                  }

                  return (
                    <tr key={product.id}>
                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="thumbnail-frame"
                          />
                        ) : (
                          <div className="thumbnail-empty-state">
                            NO IMG
                          </div>
                        )}
                      </td>

                      <td>
                        <span className="item-identity-text">
                          {product.name}
                        </span>
                      </td>

                      <td>
                        <span className="supplier-identity-text">
                          {product.supplier_id || "Global Supplier"}
                        </span>
                      </td>

                      <td>
                        <span className="category-pill-tag">
                          {product.category || "General"}
                        </span>
                      </td>

                      <td
                        className="capacity-indicator"
                        style={{
                          color: isOutOfStock ? "#ef4444" : "#334155",
                          fontWeight: isOutOfStock ? "600" : "500",
                        }}
                      >
                        {isOutOfStock
                          ? "Out of Stock"
                          : `${product.stock} units`}
                      </td>

                      <td>
                        <span className="price-valuation-text">
                          ₹{Number(product.price).toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <span
                          className="status-pill-badge"
                          style={{
                            backgroundColor: badgeBg,
                            color: badgeColor,
                          }}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td>
                        <div className="actions-flex-group">
                          <button
                            className="panel-action-btn btn-view-style"
                            onClick={() =>
                              openActionModal(product, "view")
                            }
                          >
                            View
                          </button>

                          <button
                            className="panel-action-btn btn-approve-style"
                            onClick={() =>
                              openActionModal(product, "approve")
                            }
                            disabled={currentStatus === "Approved"}
                          >
                            Approve
                          </button>

                          <button
                            className="panel-action-btn btn-reject-style"
                            onClick={() =>
                              openActionModal(product, "reject")
                            }
                            disabled={currentStatus === "Rejected"}
                          >
                            Reject
                          </button>

                          <button
                            className="panel-action-btn btn-delete-style"
                            onClick={() =>
                              openActionModal(product, "delete")
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-grid-fallback">
                    No product entries found inside system master inventory
                    listing database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalType && selectedProduct && (
        <div
          className="modal-blur-backdrop"
          onClick={closeActionModal}
        >
          <div
            className="modal-surface-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-main-heading">
              {modalType === "view"
                ? "Catalog Product Specification"
                : `${modalType} Item Record`}
            </h2>

            {modalType === "view" ? (
              <>
                {selectedProduct.image && (
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      style={{
                        maxWidth: "140px",
                        maxHeight: "140px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                        boxShadow:
                          "0 4px 6px -1px rgba(0,0,0,0.05)",
                      }}
                    />
                  </div>
                )}

                <div className="modal-specs-list">
                  <div className="modal-spec-row">
                    <span className="modal-meta-label">
                      Item Registry ID:
                    </span>
                    <span className="modal-meta-value">
                      #{selectedProduct.id}
                    </span>
                  </div>

                  <div className="modal-spec-row">
                    <span className="modal-meta-label">
                      Product Designation:
                    </span>
                    <span className="modal-meta-value">
                      {selectedProduct.name}
                    </span>
                  </div>

                  <div className="modal-spec-row">
                    <span className="modal-meta-label">
                      Category Context:
                    </span>
                    <span className="modal-meta-value">
                      {selectedProduct.category || "General"}
                    </span>
                  </div>

                  <div className="modal-spec-row">
                    <span className="modal-meta-label">
                      Origin Supplier:
                    </span>
                    <span className="modal-meta-value">
                      {selectedProduct.supplier_id || "N/A"}
                    </span>
                  </div>

                  <div className="modal-spec-row">
                    <span className="modal-meta-label">
                      Current Stock Level:
                    </span>
                    <span className="modal-meta-value">
                      {selectedProduct.stock} units
                    </span>
                  </div>

                  <div className="modal-spec-row">
                    <span className="modal-meta-label">
                      Market Pricing:
                    </span>
                    <span className="modal-meta-value">
                      ₹{Number(selectedProduct.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="modal-spec-row">
                    <span className="modal-meta-label">
                      Compliance Status:
                    </span>

                    <span
                      className="modal-meta-value"
                      style={{ color: "#3b82f6" }}
                    >
                      {localStatuses[selectedProduct.id] ||
                        "Pending Verification"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="modal-prompt-message">
                Are you sure you want to proceed with executing the item
                modification task to{" "}
                <strong
                  style={{
                    color:
                      modalType === "delete" ||
                      modalType === "reject"
                        ? "#ef4444"
                        : "#10b981",
                  }}
                >
                  [
                  {modalType === "delete"
                    ? "Permanently Removed"
                    : modalType === "approve"
                    ? "Approved"
                    : "Rejected"}
                  ]
                </strong>{" "}
                for database item entry "
                {selectedProduct.name}" (ID: {selectedProduct.id})?
              </p>
            )}

            <div className="modal-footer-actions">
              <button
                className="modal-dialog-btn modal-btn-cancel"
                onClick={closeActionModal}
              >
                {modalType === "view" ? "Close" : "Cancel"}
              </button>

              {modalType !== "view" && (
                <button
                  className="modal-dialog-btn modal-btn-execution"
                  onClick={handleConfirmAction}
                  style={{
                    backgroundColor:
                      modalType === "delete" ||
                      modalType === "reject"
                        ? "#ef4444"
                        : "#10b981",
                  }}
                >
                  Confirm Action
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}