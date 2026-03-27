import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const onboardingApi = {
  initSession: async () => {
    const res = await apiClient.post('/onboarding/sessions');
    return res.data;
  },
  getSession: async (sessionId: string) => {
    const res = await apiClient.get(`/onboarding/sessions/${sessionId}`);
    return res.data;
  },
  updateSession: async (sessionId: string, step: number, data: any) => {
    const res = await apiClient.patch(`/onboarding/sessions/${sessionId}`, { step, data });
    return res.data;
  },
  submitSession: async (sessionId: string) => {
    const res = await apiClient.post(`/onboarding/sessions/${sessionId}/submit`);
    return res.data;
  }
};

export const usersApi = {
  fetchAll: async () => {
    const res = await apiClient.get('/users');
    return res.data;
  },
};

export default apiClient;
