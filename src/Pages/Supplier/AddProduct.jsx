import React, { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { toast } from "react-toastify";
import { useInventory } from "../../Context/Inventorycontext"; // Import global context engine

export default function AddProduct() {
  // Use global shared state instead of local useState configuration
  const { products, setProducts } = useInventory();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  // Local state to keep track of products added ONLY during the current active session
  const [recentlyAdded, setRecentlyAdded] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price || !form.stock) {
      toast.error("Please fill all fields");
      return;
    }

    // Auto-calculate structural status strings to match your StockList table configurations
    const currentStock = Number(form.stock);
    let calculatedStatus = "In Stock";
    if (currentStock === 0) {
      calculatedStatus = "Out of Stock";
    } else if (currentStock <= 5) {
      calculatedStatus = "Low Stock";
    }

    const inputName = form.name.trim();
    const inputPrice = Number(form.price);

    // Check if product already exists in system storage to aggregate the count
    const existingIndex = products.findIndex(
      (p) => p.name.toLowerCase() === inputName.toLowerCase()
    );

    let updatedProducts = [...products];
    let loggedItem = null;

    if (existingIndex !== -1) {
      // Product exists -> Accumulate stock levels and capture the updated object
      const existingProduct = products[existingIndex];
      const nextStockTotal = existingProduct.stock + currentStock;

      let nextStatus = "In Stock";
      if (nextStockTotal === 0) nextStatus = "Out of Stock";
      else if (nextStockTotal <= 5) nextStatus = "Low Stock";

      const updatedProduct = {
        ...existingProduct,
        stock: nextStockTotal,
        price: inputPrice, 
        status: nextStatus,
      };

      updatedProducts[existingIndex] = updatedProduct;
      loggedItem = updatedProduct;
    } else {
      // Product is completely new -> Append fresh record entry node
      const newProduct = {
        id: Date.now(),
        name: inputName,
        category: form.category,
        price: inputPrice,
        stock: currentStock,
        status: calculatedStatus,
        image: "https://unsplash.com"
      };

      updatedProducts = [newProduct, ...updatedProducts];
      loggedItem = newProduct;
    }

    // Commit changes securely to your global system state context tree
    setProducts(updatedProducts);

    // Track it locally inside session tracker state arrays
    setRecentlyAdded((prev) => {
      const filtered = prev.filter((item) => item.name.toLowerCase() !== inputName.toLowerCase());
      return [loggedItem, ...filtered];
    });

    toast.success("Product added successfully");

    setForm({
      name: "",
      category: "",
      price: "",
      stock: "",
    });
  };

  const layoutContainerStyle = {
    display: "flex",
    gap: "32px",
    width: "100%",
    alignItems: "flex-start",
    boxSizing: "border-box",
    flexWrap: "wrap"
  };

  const formContainerStyle = {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03)",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  };

  const rightSideContainerStyle = {
    flex: 1,
    minWidth: "320px",
    boxSizing: "border-box"
  };

  const listScrollStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxHeight: "480px",
    overflowY: "auto",
    paddingRight: "8px",
    boxSizing: "border-box"
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px 0", fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
          Add Product
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
          Create and catalog new inventory items into the warehouse systems.
        </p>
      </div>

      <div style={layoutContainerStyle}>
        {/* LEFT COLUMN: FORM */}
        <div style={formContainerStyle}>
          <form onSubmit={handleSubmit}>
            <Input
              label="Product Name"
              name="name"
              placeholder="Enter product name..."
              value={form.name}
              onChange={handleChange}
            />

            <Input
              label="Category"
              name="category"
              placeholder="Enter category..."
              value={form.category}
              onChange={handleChange}
            />

            <Input
              label="Price"
              name="price"
              type="number"
              placeholder="₹ 0.00"
              value={form.price}
              onChange={handleChange}
            />

            <Input
              label="Stock"
              name="stock"
              type="number"
              placeholder="Enter stock quantity..."
              value={form.stock}
              onChange={handleChange}
            />

            <Button type="submit" variant="primary" style={{ width: "100%", marginTop: "12px", height: "42px" }}>
              Add Product Item
            </Button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE SYSTEM STOCK */}
        <div style={rightSideContainerStyle}>
          {/* Section 1: All current global system products */}
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
            Current System Stock
          </h3>
          
          {products && products.length > 0 ? (
            <div style={{ ...listScrollStyle, marginBottom: "32px" }}>
              {products.map((p) => (
                <Card
                  key={p.id}
                  title={`${p.category} • ${p.stock} Units`}
                  value={`₹${Number(p.price).toLocaleString("en-IN")}`}
                  icon={
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
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", display: "block" }}>
                          {p.name}
                        </span>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <div 
              style={{
                border: "2px dashed #e2e8f0",
                borderRadius: "12px",
                padding: "40px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "14px",
                marginBottom: "32px"
              }}
            >
              No products found in system storage.
            </div>
          )}

          {/* Section 2: Segregated list displaying items added during this current open operational session */}
          <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", color: "#0f172a" }}>
            Recently Added This Session
          </h3>

          {recentlyAdded.length > 0 ? (
            <div style={listScrollStyle}>
              {recentlyAdded.map((p) => (
                <Card
                  key={`session-${p.id}`}
                  title={`${p.category} • Last Added State`}
                  value={`₹${Number(p.price).toLocaleString("en-IN")}`}
                  icon={
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
                      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#0f172a", display: "block" }}>
                          {p.name}
                        </span>
                      </div>
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <div 
              style={{
                border: "2px dashed #e2e8f0",
                borderRadius: "12px",
                padding: "40px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "14px"
              }}
            >
              No products added during this session yet.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
