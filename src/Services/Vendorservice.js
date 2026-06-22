import API from "./api";

export const vendorService = {
  getDashboardMetrics: async () => {
    const response = await API.get("/vendor/metrics");
    return response.data;
  },

  getProfileDetails: async () => {
    const response = await API.get("/vendor/profile");
    return response.data;
  },

  updateProfileDetails: async (profilePayload) => {
    const response = await API.put("/vendor/profile", profilePayload);
    return response.data;
  },

  getBrowseProducts: async () => {
    const response = await API.get("/vendor/browse-products");
    return response.data;
  },

  getMyOrders: async () => {
    const response = await API.get("/vendor/orders");
    return response.data;
  },

  getProductRequests: async () => {
    const response = await API.get("/vendor/product-requests");
    return response.data;
  },

  requestProduct: async (requestPayload) => {
    const response = await API.post("/vendor/product-requests", requestPayload);
    return response.data;
  }
};
