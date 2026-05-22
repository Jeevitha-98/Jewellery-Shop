import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useVendor } from "../../Context/Vendorcontext";

export default function BrowseProducts() {
  const { availableProducts, loading, createProductRequest, refreshVendorData } = useVendor();
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [requestQuantity, setRequestQuantity] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  useEffect(() => {
    if (refreshVendorData) {
      refreshVendorData();
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const handleView = (product) => {
    alert(`Product: ${product.name}\nCategory: ${product.category}\nAvailable Stock: ${product.stock}\nWholesale Price: ₹${product.price}\nSupplier Name: ${product.supplier_name || product.supplier_id}`);
  };

  const handleRequestClick = (product) => {
    setSelectedProduct(product);
    setRequestQuantity(1);
    setIsOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedProduct || requestQuantity < 1) return;
    
    setActionLoading(true);
    const payload = {
      supplier_id: selectedProduct.supplier_id,
      product_name: selectedProduct.name,
      quantity: Number(requestQuantity)
    };

    const result = await createProductRequest(payload);
    setActionLoading(false);

    if (result.success) {
      alert(`Procurement request for ${requestQuantity} units submitted safely!`);
      setIsOpen(false);
      setSelectedProduct(null);
    } else {
      alert(`Error: ${result.error || "Failed to process request"}`);
    }
  };

  const continuousCategories = Array.from(new Set((availableProducts || []).map((p) => p && p.category).filter(Boolean)));

  const filteredProducts = (availableProducts || [])
    .filter((p) => p && (p?.name || "").toLowerCase().includes(search.toLowerCase()))
    .filter((p) => p && (category ? p?.category === category : true));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const headerWrapperStyle = {
    fontFamily: "'Inter', sans-serif",
    marginBottom: "32px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "16px",
    textAlign: "left"
  };

  const mainHeadingStyle = {
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.02em"
  };

  const subHeadingStyle = {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "400"
  };

  const unifiedConsoleBarStyle = {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "800px", 
    height: "50px",
    backgroundColor: "#ffffff",
    borderRadius: "25px", 
    border: "1px solid #cbd5e1",
    padding: "0 24px 0 20px",
    boxShadow: "0 4px 10px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    boxSizing: "border-box",
    marginBottom: "36px",
    gap: "12px",
    transition: "all 0.2s ease-in-out",
    fontFamily: "'Inter', sans-serif"
  };

  const searchInputWrapperStyle = {
    display: "flex",
    alignItems: "center",
    flex: 1,
    height: "100%",
    position: "relative",
    gap: "12px"
  };

  const cleanRawInputStyle = {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    backgroundColor: "transparent",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "400"
  };

  const verticalDividerLineStyle = {
    width: "1px",
    height: "24px",
    backgroundColor: "#e2e8f0",
    margin: "0 8px"
  };

  const premiumDropdownSelectStyle = {
    border: "none",
    outline: "none",
    fontSize: "13px",
    color: "#475569",
    backgroundColor: "transparent",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "600",
    cursor: "pointer",
    paddingRight: "8px",
    minWidth: "140px",
    height: "100%",
    textAlign: "right"
  };

  const productGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
    width: "100%",
    boxSizing: "border-box"
  };

  const itemCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxSizing: "border-box",
    position: "relative"
  };

  const imageFrameStyle = {
    width: "100%",
    height: "180px",
    borderRadius: "12px",
    objectFit: "cover",
    backgroundColor: "#f8fafc",
    border: "1px solid #f1f5f9"
  };

  const cardMetaRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    textAlign: "left"
  };

  const productTitleStyle = {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.01em"
  };

  const categoryTagStyle = {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
    marginTop: "2px",
    display: "block"
  };

  const actionGroupStyle = {
    display: "flex",
    gap: "8px",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "auto"
  };

  const actionButtonStyle = {
    flex: 1,
    height: "36px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "background-color 0.15s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box"
  };

  const paginationWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "40px",
    fontFamily: "'Inter', sans-serif"
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh", width: "100%" }}>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ width: "40px", height: "40px", border: "3px solid #cbd5e1", borderTop: "3px solid #2563eb", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div style={headerWrapperStyle}>
        <h2 style={mainHeadingStyle}>Browse Marketplace Catalog</h2>
        <p style={subHeadingStyle}>Explore products available across wholesalers and raise logistics fulfillment requests.</p>
      </div>

      <div 
        style={unifiedConsoleBarStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#2563eb";
          e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(37, 99, 235, 0.08), 0 8px 10px -6px rgba(37, 99, 235, 0.08)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#cbd5e1";
          e.currentTarget.style.boxShadow = "0 4px 10px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
        }}
      >
        <div style={searchInputWrapperStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text"
            placeholder="Type to filter marketplace entries by name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={cleanRawInputStyle}
          />
        </div>

        <div style={verticalDividerLineStyle} />

        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={premiumDropdownSelectStyle}
          >
            <option value="">All Categories</option>
            {continuousCategories.map((cat, i) => (
              <option key={i} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={productGridStyle}>
        {currentProducts && currentProducts.length > 0 ? (
          currentProducts.map((p) => {
            if (!p) return null;
            const isOutOfStock = Number(p.stock || 0) === 0;

            return (
              <div 
                key={p.id}
                style={itemCardStyle}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 20px -8px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.01)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03)";
                }}
              >
                {p.image ? (
                  <img src={p.image} alt={p.name} style={imageFrameStyle} />
                ) : (
                  <div style={{ ...imageFrameStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                )}

                <div style={cardMetaRowStyle}>
                  <div>
                    <h4 style={productTitleStyle}>{p.name}</h4>
                    <span style={categoryTagStyle}>{p.category || "General"}</span>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                    ₹{Number(p.price || 0).toLocaleString("en-IN")}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "10px", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Supplier Name:</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>{p.supplier_name || p.supplier_id || "Unknown"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Status Stock:</span>
                    <span style={{ fontWeight: "700", color: isOutOfStock ? "#ef4444" : "#16a34a" }}>
                      {isOutOfStock ? "Out of Stock" : `${p.stock} units`}
                    </span>
                  </div>
                </div>

                <div style={actionGroupStyle}>
                  <button 
                    style={{ ...actionButtonStyle, backgroundColor: "#f1f5f9", color: "#334155" }}
                    onClick={() => handleView(p)}
                  >
                    View Info
                  </button>
                  <button 
                    style={{ ...actionButtonStyle, backgroundColor: isOutOfStock ? "#e2e8f0" : "#2563eb", color: "#ffffff", cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                    disabled={isOutOfStock}
                    onClick={() => handleRequestClick(p)}
                  >
                    Request Product
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", padding: "64px 20px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", color: "#64748b", fontFamily: "'Inter', sans-serif" }}>
            No marketplace matching products catalog found.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={paginationWrapperStyle}>
          <Button 
            variant="secondary" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span style={{ fontSize: "14px", color: "#334155", fontWeight: "500" }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="secondary" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}

      {isOpen && selectedProduct && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Raise Procurement Request">
          <div style={{ display: "flex", flexDirection: "column", gap: "18px", fontFamily: "'Inter', sans-serif", textAlign: "left" }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
              Submit an inventory restock procurement pipeline operation to wholesaler <strong>{selectedProduct.supplier_name || selectedProduct.supplier_id}</strong>.
            </p>
            
            <Input 
              label="Selected Product Item" 
              value={selectedProduct.name} 
              readOnly 
              disabled
            />
            
            <Input 
              label="Procurement Unit Quantity" 
              type="number" 
              min="1" 
              max={selectedProduct.stock}
              value={requestQuantity} 
              onChange={(e) => setRequestQuantity(e.target.value)}
            />
            <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "-12px", display: "block" }}>
              Maximum catalog availability: {selectedProduct.stock} units
            </span>

            <div style={{ display: "flex", gap: "12px", marginTop: "12px", justifyContent: "flex-end" }}>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRequest} disabled={actionLoading}>
                {actionLoading ? "Submitting..." : "Send Request"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}
