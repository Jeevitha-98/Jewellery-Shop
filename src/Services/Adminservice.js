import API from "./api";

const adminService = {
  getProfile: async () => {
    const response = await API.get("/admin/profile");
    return response.data;
  },

  getMetrics: async () => {
    const response = await API.get("/admin/metrics");
    return response.data;
  },

  getSuppliers: async () => {
    const response = await API.get("/admin/suppliers");
    return response.data;
  },

  getVendors: async () => {
    const response = await API.get("/admin/vendors");
    return response.data;
  },

  getProducts: async () => {
    const response = await API.get("/admin/products");
    return response.data;
  }
};

export default adminService;
