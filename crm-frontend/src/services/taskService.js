import api from "./api";

export const taskService = {

  getAll(page = 0, size = 10000) {
    return api.get(`/api/tasks?page=${page}&size=${size}`);
  },

  create: (data) => api.post("/api/tasks", data),

  update: (id, data) => api.put(`/api/tasks/${id}`, data),

  delete: (id) => api.delete(`/api/tasks/${id}`),
};