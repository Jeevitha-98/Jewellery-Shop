import API from "./api";

export const vendorService = {
  getDashboardMetrics: async () => {
    const response = await API.get("/Vendor/metrics");
    return response.data;
  },

  getProfileDetails: async () => {
    const response = await API.get("/Vendor/profile");
    return response.data;
  },

  updateProfileDetails: async (profilePayload) => {
    const response = await API.put("/Vendor/profile", profilePayload);
    return response.data;
  },

  getBrowseProducts: async () => {
    const response = await API.get("/Vendor/browse-products");
    return response.data;
  },

  getMyOrders: async () => {
    const response = await API.get("/Vendor/orders");
    return response.data;
  },

  getProductRequests: async () => {
    const response = await API.get("/Vendor/product-requests");
    return response.data;
  },

  requestProduct: async (requestPayload) => {
    const response = await API.post("/Vendor/product-requests", requestPayload);
    return response.data;
  }
};
