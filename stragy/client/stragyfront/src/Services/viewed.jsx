import api from './api';

export const getViewed = async() => api.get(`/api/viewed`);
export const logViewed = async(data) => api.post(`/api/viewed`, data);
export const deleteViewed = async(id) => api.delete(`/api/viewed/${id}`);