import axios from 'axios';

export type PlaylistRequest = {
  nome: string;
  exibirNoPlayer: boolean;
  midiasIds: string[];
};

const api = axios.create({
  baseURL: 'https://localhost:7202',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPlaylist = async (playlist: PlaylistRequest) => {
  const response = await api.post("/api/PlayList", playlist);
  return response.data;
};

export const getPlaylists = async () => {
    const response = await api.get('/api/Playlist');
    return response.data;
}

export const addMidiaToPlaylist = async (playlistId: string, midiaId: string) => {
  const response = await api.post(`/api/PlayList/${playlistId}/midias/${midiaId}`);
  return response.data;
};

export const removeMidiaFromPlaylist = async (playlistId: string, midiaId: string) => {
  const response = await api.delete(`/api/PlayList/${playlistId}/midias/${midiaId}`);
  return response.data;
};



