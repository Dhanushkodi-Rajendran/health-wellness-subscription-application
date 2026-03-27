import { useQuery, useMutation } from '@tanstack/react-query';
import { onboardingApi } from '../api/apiClient';

export const useOnboardingSession = (sessionId: string | null) => {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => onboardingApi.getSession(sessionId!),
    enabled: !!sessionId,
  });
};

export const useSaveProgress = () => {
  return useMutation({
    mutationFn: ({ sessionId, step, data }: { sessionId: string; step: number; data: any }) => 
      onboardingApi.updateSession(sessionId, step, data),
  });
};

export const useInitSession = () => {
  return useMutation({
    mutationFn: () => onboardingApi.initSession(),
  });
};

export const useSubmitSession = () => {
  return useMutation({
    mutationFn: (sessionId: string) => onboardingApi.submitSession(sessionId),
  });
};
