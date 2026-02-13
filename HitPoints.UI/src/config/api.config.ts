const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5259';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  signalRHubUrl: `${API_BASE_URL}/hubs/character`,
} as const;
