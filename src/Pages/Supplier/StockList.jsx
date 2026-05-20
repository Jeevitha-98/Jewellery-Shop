import React, { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useInventory } from "../../Context/Inventorycontext";

function ProductTable({ products, onEdit, onDelete, onView }) {
  const cellStyle = {
    padding: "16px 20px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    verticalAlign: "middle",
    boxSizing: "border-box",
  };

  const thStyle = {
    padding: "16px 20px",
    background: "#f8fafc",
    color: "#64748b",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    boxSizing: "border-box",
  };

  const inlineBtnBase = {
    height: "36px",
    padding: "0 16px",
    borderRadius: "8px",
    border: "1px solid transparent",
    fontSize: "13px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
  };

  return (
    <div 
      style={{ 
        background: "white", 
        borderRadius: "12px", 
        border: "1px solid #e2e8f0", 
        overflow: "hidden", 
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)"
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", boxSizing: "border-box" }}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((p) => (
              <tr 
                key={p.id}
                style={{ transition: "background 0.2s", boxSizing: "border-box" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={cellStyle}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", boxSizing: "border-box" }}>
                    <img 
                      src={p.image || "https://unsplash.com"} 
                      alt={p.name} 
                      style={{ 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "8px", 
                        objectFit: "cover", 
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#f8fafc"
                      }} 
                    />
                    <span style={{ fontWeight: "500", color: "#0f172a" }}>{p.name}</span>
                  </div>
                </td>
                
                <td style={cellStyle}>{p.category}</td>
                <td style={{ ...cellStyle, fontFamily: "monospace", color: "#475569" }}>{p.stock}</td>
                <td style={{ ...cellStyle, fontWeight: "500" }}>₹{p.price}</td>
                
                <td style={cellStyle}>
                  <span
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "1px solid",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "inline-block",
                      boxSizing: "border-box",
                      backgroundColor: p.stock > 5 ? "#f0fdf4" : p.stock > 0 ? "#fefce8" : "#fef2f2",
                      borderColor: p.stock > 5 ? "#bbf7d0" : p.stock > 0 ? "#fef08a" : "#fee2e2",
                      color: p.stock > 5 ? "#166534" : p.stock > 0 ? "#854d0e" : "#991b1b",
                    }}
                  >
                    {p.stock > 5 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"}
                  </span>
                </td>

                <td style={cellStyle}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", boxSizing: "border-box" }}>
                    <button 
                      onClick={() => onView(p)} 
                      style={{ ...inlineBtnBase, backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#475569" }}
                    >
                      View
                    </button>

                    <button 
                      onClick={() => onEdit(p)} 
                      style={{ ...inlineBtnBase, backgroundColor: "#2563eb", color: "#ffffff" }}
                    >
                      Edit
                    </button>

                    <button 
                      onClick={() => onDelete(p.id)} 
                      style={{ ...inlineBtnBase, backgroundColor: "#fef2f2", borderColor: "#fee2e2", color: "#dc2626" }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ ...cellStyle, textAlign: "center", color: "#64748b", padding: "32px" }}>
                No products found matching filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function StockList() {
  const { products, setProducts } = useInventory();
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEdit = (product) => {
    setSelectedProduct({ ...product });
    setIsOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedProduct?.id) return;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === selectedProduct.id) {
          const updatedStock = Number(selectedProduct.stock);
          let updatedStatus = "In Stock";
          if (updatedStock === 0) updatedStatus = "Out of Stock";
          else if (updatedStock <= 5) updatedStatus = "Low Stock";

          return {
            ...selectedProduct,
            stock: updatedStock,
            price: Number(selectedProduct.price),
            status: updatedStatus
          };
        }
        return p;
      })
    );

    setIsOpen(false);
    setSelectedProduct(null);
  };

  const handleView = (product) => {
    alert(`Product: ${product.name}\nCategory: ${product.category}\nStock: ${product.stock}\nPrice: ₹${product.price}`);
  };

  const continuousCategories = Array.from(new Set((products || []).map((p) => p.category).filter(Boolean)));

  const filteredProducts = (products || [])
    .filter((p) => (p?.name || "").toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (category ? p?.category === category : true));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <PageContainer>
      <div>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>Stock Management</h2>
        <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#64748b" }}>Manage your products, stock levels, and inventory</p>
      </div>

      {/* FILTER PANEL ROW CONTAINER */}
      <div 
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-end", 
          flexWrap: "wrap",
          width: "100%",
          boxSizing: "border-box",
          background: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "24px"
        }}
      >
        {/* LEFT COLUMN: STANDARDIZED NATIVE INPUT BOX TO ENSURE BASELINE ALIGNMENT */}
        <div style={{ flex: 1, minWidth: "260px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }}>
            Search Product
          </label>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: "40px",
              width: "100%",
              padding: "0 12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: "14px",
              color: "#0f172a",
              backgroundColor: "#ffffff",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* RIGHT COLUMN: CATEGORY MENU */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "240px" }}>
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155", display: "block" }}>
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              height: "40px",
              width: "100%",
              padding: "0 12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: "14px",
              color: "#0f172a",
              backgroundColor: "#ffffff",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
          >
            <option value="">All Categories</option>
            {continuousCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <ProductTable 
        products={currentProducts} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onView={handleView} 
      />

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "24px" }}>
          <Button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage((p) => p - 1)}
            variant="secondary"
          >
            Previous
          </Button>
          <span style={{ fontSize: "14px", color: "#475569" }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage((p) => p + 1)}
            variant="secondary"
          >
            Next
          </Button>
        </div>
      )}

      {isOpen && selectedProduct && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Product Matrix">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "4px 0" }}>
            <Input
              label="Product Name"
              value={selectedProduct.name}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
            />
            <Input
              label="Category"
              value={selectedProduct.category}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
            />
            <Input
              label="Price (₹)"
              type="number"
              value={selectedProduct.price}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
            />
            <Input
              label="Stock Count"
              type="number"
              value={selectedProduct.stock}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })}
            />
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleUpdate}>Save Modifications</Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}
