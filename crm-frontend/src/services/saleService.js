import api from "./api";

export const saleService = {

  getAll(page = 0, size = 10000) {
    return api.get(`/api/sales?page=${page}&size=${size}`);
  },

  getById: (id) => api.get(`/api/sales/${id}`),

  create: (data) => api.post("/api/sales", data),

  update: (id, data) => api.put(`/api/sales/${id}`, data),

};