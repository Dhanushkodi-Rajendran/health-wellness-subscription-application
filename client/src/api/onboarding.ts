const BASE_URL = 'http://localhost:3000/api/v1/onboarding/sessions';

export const onboardingApi = {
  initSession: async () => {
    const res = await fetch(BASE_URL, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to init session');
    return res.json();
  },
  getSession: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}/${sessionId}`);
    if (!res.ok) throw new Error('Session not found');
    return res.json();
  },
  updateSession: async (sessionId: string, step: number, data: any) => {
    const res = await fetch(`${BASE_URL}/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step, data }),
    });
    if (!res.ok) throw new Error('Failed to save progress');
    return res.json();
  },
  submitSession: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}/${sessionId}/submit`, { method: 'POST' });
    if (!res.ok) throw new Error('Submission failed');
    return res.json();
  }
};
