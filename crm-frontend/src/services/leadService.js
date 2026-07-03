import api from "./api";

export const leadService = {
  getAll(page = 0, size = 10000) {
    return api.get(`/api/leads?page=${page}&size=${size}`);
  },

  create: (data) => api.post("/api/leads", data),

  update: (id, data) => api.put(`/api/leads/${id}`, data),

  delete: (id) => api.delete(`/api/leads/${id}`),
};