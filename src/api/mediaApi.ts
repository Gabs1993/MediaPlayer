import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7202",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getMedias = async () => {
  const response = await api.get("/api/Midia");
  return response.data;
};


export const updateMedia = async (id: string, data: { name: string; description: string; filePath: string; fileType: string }) => {
  const response = await api.put(`/api/Midia/${id}`, data);
  return response.data;
};


export const deleteMedia = async (id: string) => {
  const response = await api.delete(`/api/Midia/${id}`);
  return response.data;
};

export const createMedia = async (data: { name: string; description: string; filePath: string; fileType: string }) => {
  const response = await api.post("/api/Midia", data);
  return response.data;
}

export default api;

