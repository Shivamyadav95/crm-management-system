import api from "./api";

export const customerService = {

  getAll(page = 0, size = 10000) {
    return api.get(`/api/customers?page=${page}&size=${size}`);
  },

  create: (data) => api.post("/api/customers", data),

  update: (id, data) => api.put(`/api/customers/${id}`, data),

  delete: (id) => api.delete(`/api/customers/${id}`),
};