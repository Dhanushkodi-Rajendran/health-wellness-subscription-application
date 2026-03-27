const BASE_URL = 'http://localhost:3000/api/v1/users';

export const usersApi = {
  fetchAll: async () => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
};
