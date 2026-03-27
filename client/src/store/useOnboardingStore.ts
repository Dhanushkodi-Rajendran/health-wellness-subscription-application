import { create } from 'zustand';

export type OnboardingSessionData = {
  sessionId: string | null;
  status: 'in_progress' | 'completed' | 'ineligible';
  currentStep: number;
  basicInfo: {
    fullName?: string;
    email?: string;
    age?: number | '';
    country?: string;
  };
  healthScreening: {
    conditions: string[];
    diabetesControlled?: boolean;
    recentCardiacEvent?: boolean;
  };
  planSelection?: 'Monthly' | 'Quarterly' | 'Annual';
  ineligibilityReason?: string;
};

interface OnboardingStore {
  data: OnboardingSessionData;
  validationErrors: Record<string, string>;
  setSessionId: (id: string) => void;
  setFullData: (data: Partial<OnboardingSessionData>) => void;
  updateBasicInfo: (info: Partial<OnboardingSessionData['basicInfo']>) => void;
  updateHealthScreening: (info: Partial<OnboardingSessionData['healthScreening']>) => void;
  setPlan: (plan: 'Monthly' | 'Quarterly' | 'Annual') => void;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearValidationErrors: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  terminateFlow: (reason: string) => void;
  resetSession: () => void;
}

const initialState: OnboardingSessionData = {
  sessionId: null,
  status: 'in_progress',
  currentStep: 1,
  basicInfo: { fullName: '', email: '', age: '', country: '' },
  healthScreening: { conditions: [] },
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  data: initialState,
  validationErrors: {},
  setSessionId: (id) => set((state) => ({ data: { ...state.data, sessionId: id } })),
  setFullData: (newData) => set((state) => ({ 
    data: { 
      ...state.data, 
      ...newData,
      basicInfo: { ...state.data.basicInfo, ...(newData.basicInfo || {}) },
      healthScreening: { ...state.data.healthScreening, ...(newData.healthScreening || {}) }
    } 
  })),
  updateBasicInfo: (info) => 
    set((state) => ({ data: { ...state.data, basicInfo: { ...state.data.basicInfo, ...info } } })),
  updateHealthScreening: (info) =>
    set((state) => ({ data: { ...state.data, healthScreening: { ...state.data.healthScreening, ...info } } })),
  setPlan: (plan) => set((state) => ({ data: { ...state.data, planSelection: plan } })),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  clearValidationErrors: () => set({ validationErrors: {} }),
  nextStep: () => set((state) => ({ data: { ...state.data, currentStep: Math.min(4, state.data.currentStep + 1) } })),
  prevStep: () => set((state) => ({ data: { ...state.data, currentStep: Math.max(1, state.data.currentStep - 1) } })),
  setStep: (step) => set((state) => ({ data: { ...state.data, currentStep: step } })),
  terminateFlow: (reason) => set((state) => ({ data: { ...state.data, status: 'ineligible', ineligibilityReason: reason } })),
  resetSession: () => set({ data: { ...initialState }, validationErrors: {} }),
}));
