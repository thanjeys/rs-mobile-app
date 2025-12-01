import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com/",
});

// Function to set auth token - will be called from authStore
export const setApiToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export default api;
