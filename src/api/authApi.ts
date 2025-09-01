import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7202', 
});


export const login = async (email: string, password: string) => {
  const response = await api.post('/Auth/login', { email, password });
  return response.data;
};


export const register = async (data: { email: string; password: string }) => {
  const response = await api.post('api/User', data);
  return response.data;
};
