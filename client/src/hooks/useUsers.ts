import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/apiClient';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.fetchAll(),
  });
};
