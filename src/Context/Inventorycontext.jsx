import React, { createContext, useState, useContext } from "react";
import initialProducts from "../data/dummyproducts"; 

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);

  const [vendorRequests, setVendorRequests] = useState([
    { id: 1, vendorName: "John Traders", product: "Rice", quantity: 2, status: "Pending" },
    { id: 2, vendorName: "Fresh Mart", product: "Wheat", quantity: 1, status: "Pending" },
    { id: 3, vendorName: "City Store", product: "Sugar", quantity: 5, status: "Pending" },
  ]);

  const addGlobalProduct = (newProduct) => {
    const currentStock = Number(newProduct.stock);
    let calculatedStatus = "In Stock";
    if (currentStock === 0) {
      calculatedStatus = "Out of Stock";
    } else if (currentStock <= 5) {
      calculatedStatus = "Low Stock";
    }

    const refinedItem = {
      ...newProduct,
      id: Date.now(),
      price: Number(newProduct.price),
      stock: currentStock,
      status: calculatedStatus,
      image: newProduct.image || "https://unsplash.com"
    };

    setProducts((prev) => [refinedItem, ...prev]);
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        products: [...products], 
        setProducts: (newProducts) => setProducts([...newProducts]), 
        vendorRequests: [...vendorRequests], 
        setVendorRequests: (newRequests) => setVendorRequests([...newRequests]), 
        addGlobalProduct 
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
