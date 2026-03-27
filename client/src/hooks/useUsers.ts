import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.fetchAll(),
  });
};
